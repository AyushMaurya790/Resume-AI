import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import '../../styles/PaymentModal.css';

// Stripe configuration
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

// Payment Form Component
const PaymentForm = ({ amount, onSuccess, onClose, promoCode, setPromoCode }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [isPromoValid, setIsPromoValid] = useState(false);

  const finalAmount = amount - discount;

  const handlePromoApply = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/validate-promo', { code: promoCode });
      if (response.data.valid) {
        setDiscount(response.data.discount);
        setIsPromoValid(true);
      } else {
        setError('Invalid promo code');
        setIsPromoValid(false);
      }
    } catch (err) {
      setError('Error validating promo code');
      setIsPromoValid(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (paymentMethod === 'stripe') {
        // Stripe payment
        if (!stripe || !elements) return;

        const { error: stripeError, paymentMethod: stripePaymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: elements.getElement(CardElement),
        });

        if (stripeError) {
          setError(stripeError.message);
          return;
        }

        const { data: clientSecret } = await axios.post('/api/create-payment-intent', {
          amount: finalAmount * 100, // Convert to cents
          payment_method_id: stripePaymentMethod.id,
          promo_code: isPromoValid ? promoCode : null,
        });

        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret);

        if (confirmError) {
          setError(confirmError.message);
          return;
        }

        if (paymentIntent.status === 'succeeded') {
          onSuccess(paymentIntent.id);
        }
      } else {
        // Razorpay payment
        const { data: order } = await axios.post('/api/create-razorpay-order', {
          amount: finalAmount * 100, // Convert to paise
          currency: 'INR',
          promo_code: isPromoValid ? promoCode : null,
        });

        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: 'ResumeAI',
          description: 'Resume Watermark Removal',
          order_id: order.id,
          handler: function(response) {
            onSuccess(response.razorpay_payment_id);
          },
          prefill: {
            name: 'Customer Name',
            email: 'customer@example.com',
          },
          theme: {
            color: '#3e6bff',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="payment-amount">
        <div className="amount-row">
          <span>Original Price:</span>
          <span>₹{amount}</span>
        </div>
        {discount > 0 && (
          <div className="amount-row text-red">
            <span>Discount:</span>
            <span>-₹{discount}</span>
          </div>
        )}
        <div className="amount-row total">
          <span>Total Amount:</span>
          <span>₹{finalAmount}</span>
        </div>
      </div>

      <div className="promo-section">
        <input
          type="text"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          placeholder="Enter promo code"
          className="promo-input"
        />
        <button
          type="button"
          onClick={handlePromoApply}
          className="promo-apply btn-red"
          disabled={loading || !promoCode}
        >
          {loading ? 'Checking...' : 'Apply'}
        </button>
      </div>

      <div className="payment-methods">
        <div className="method-option">
          <input
            type="radio"
            id="stripe"
            name="paymentMethod"
            checked={paymentMethod === 'stripe'}
            onChange={() => setPaymentMethod('stripe')}
          />
          <label htmlFor="stripe">Credit/Debit Card</label>
        </div>
        <div className="method-option">
          <input
            type="radio"
            id="razorpay"
            name="paymentMethod"
            checked={paymentMethod === 'razorpay'}
            onChange={() => setPaymentMethod('razorpay')}
          />
          <label htmlFor="razorpay">Razorpay (UPI, Net Banking)</label>
        </div>
      </div>

      {paymentMethod === 'stripe' && (
        <div className="card-element-container">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#ff3e3e',
                },
              },
            }}
          />
        </div>
      )}

      {error && <div className="payment-error">{error}</div>}

      <div className="payment-actions">
        <button
          type="button"
          onClick={onClose}
          className="payment-cancel btn-red"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="payment-confirm btn-blue"
        >
          {loading ? 'Processing...' : `Pay ₹${finalAmount}`}
        </button>
      </div>

      <div className="payment-security">
        <svg className="lock-icon">{/* Lock icon SVG */}</svg>
        <span>Secure payment processed by {paymentMethod === 'stripe' ? 'Stripe' : 'Razorpay'}</span>
      </div>
    </form>
  );
};

// Main Payment Modal Component
const PaymentModal = ({ show, onClose, onSuccess, amount = 99 }) => {
  const [promoCode, setPromoCode] = useState('');

  if (!show) return null;

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <div className="modal-header">
          <h2>
            <span className="text-blue">Unlock</span>{' '}
            <span className="text-red">Premium</span>
          </h2>
          <p>Remove watermark and enable downloads</p>
          <button onClick={onClose} className="close-btn">
            &times;
          </button>
        </div>

        <div className="modal-body">
          <Elements stripe={stripePromise}>
            <PaymentForm
              amount={amount}
              onSuccess={onSuccess}
              onClose={onClose}
              promoCode={promoCode}
              setPromoCode={setPromoCode}
            />
          </Elements>
        </div>

        <div className="modal-footer">
          <div className="benefits-list">
            <div className="benefit-item">
              <svg className="check-icon text-blue">{/* Check icon */}</svg>
              <span>Watermark removed</span>
            </div>
            <div className="benefit-item">
              <svg className="check-icon text-blue">{/* Check icon */}</svg>
              <span>Unlimited downloads</span>
            </div>
            <div className="benefit-item">
              <svg className="check-icon text-blue">{/* Check icon */}</svg>
              <span>Priority support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;