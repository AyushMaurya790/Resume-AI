import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import '../styles/PricingStyles.css';

// Stripe promise (replace with your publishable key)
const stripePromise = loadStripe('your_stripe_publishable_key');

const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState('single');
  const [promoCode, setPromoCode] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const plans = {
    single: {
      name: "Single Resume",
      price: 99,
      discountedPrice: 99,
      features: [
        "1 Premium Resume",
        "AI-generated content",
        "25+ Templates",
        "PDF Download",
        "Shareable Link",
        "Resume Score Analysis"
      ],
      cta: "Get Your Resume"
    },
    pro: {
      name: "Pro Package",
      price: 299,
      discountedPrice: 249,
      features: [
        "5 Premium Resumes",
        "Priority AI Generation",
        "All Templates",
        "Cover Letters Included",
        "ATS Optimization",
        "Job Match Scoring"
      ],
      cta: "Go Pro"
    },
    unlimited: {
      name: "Unlimited",
      price: 999,
      discountedPrice: 799,
      features: [
        "Unlimited Resumes",
        "Team Sharing",
        "Resume Wallet",
        "Dedicated Support",
        "Advanced Analytics",
        "Early Access to Features"
      ],
      cta: "Get Unlimited"
    }
  };

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }

    setIsApplyingPromo(true);
    setPromoError('');
    setPromoSuccess('');

    // Simulate API call to validate promo code
    setTimeout(() => {
      if (promoCode.toLowerCase() === 'resumeai25') {
        const discount = selectedPlan === 'single' ? 24.75 : 
                         selectedPlan === 'pro' ? 62.25 : 
                         199.75;
        
        plans[selectedPlan].discountedPrice = plans[selectedPlan].price - discount;
        setPromoSuccess('Promo code applied successfully!');
      } else {
        setPromoError('Invalid promo code');
      }
      setIsApplyingPromo(false);
    }, 1000);
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setPromoError('');
    setPromoSuccess('');
    // Reset discounted price when changing plans
    plans[plan].discountedPrice = plans[plan].price;
  };

  return (
    <div className="pricing-container">
      <div className="pricing-header">
        <h1>
          <span className="text-red">Resume</span>
          <span className="text-blue">AI</span> Pricing
        </h1>
        <p className="subtitle">Choose the perfect plan for your career needs</p>
      </div>

      <div className="pricing-tabs">
        <button
          className={`tab-btn ${selectedPlan === 'single' ? 'active btn-red' : 'btn-outline-red'}`}
          onClick={() => handlePlanSelect('single')}
        >
          Single Resume
        </button>
        <button
          className={`tab-btn ${selectedPlan === 'pro' ? 'active btn-blue' : 'btn-outline-blue'}`}
          onClick={() => handlePlanSelect('pro')}
        >
          Pro Package
        </button>
        <button
          className={`tab-btn ${selectedPlan === 'unlimited' ? 'active btn-red' : 'btn-outline-red'}`}
          onClick={() => handlePlanSelect('unlimited')}
        >
          Unlimited
        </button>
      </div>

      <div className="pricing-content">
        <motion.div 
          className="plan-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="plan-header">
            <h2>{plans[selectedPlan].name}</h2>
            <div className="price-display">
              {plans[selectedPlan].discountedPrice < plans[selectedPlan].price && (
                <span className="original-price">₹{plans[selectedPlan].price}</span>
              )}
              <span className="current-price">₹{plans[selectedPlan].discountedPrice}</span>
              {selectedPlan !== 'single' && (
                <span className="billing-cycle">/year</span>
              )}
            </div>
          </div>

          <ul className="plan-features">
            {plans[selectedPlan].features.map((feature, index) => (
              <li key={index}>
                <svg className="feature-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          <div className="promo-section">
            <div className="promo-input-group">
              <input
                type="text"
                placeholder="Promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className={promoError ? 'input-error' : ''}
              />
              <button 
                className="apply-promo btn-blue"
                onClick={handleApplyPromo}
                disabled={isApplyingPromo}
              >
                {isApplyingPromo ? 'Applying...' : 'Apply'}
              </button>
            </div>
            {promoError && <div className="promo-error">{promoError}</div>}
            {promoSuccess && <div className="promo-success">{promoSuccess}</div>}
          </div>

          <Elements stripe={stripePromise}>
            <CheckoutForm 
              plan={selectedPlan} 
              amount={plans[selectedPlan].discountedPrice * 100} 
              description={plans[selectedPlan].name}
            />
          </Elements>

          <div className="payment-methods">
            <div className="payment-icons">
              <img src="/icons/razorpay.svg" alt="Razorpay" />
              <img src="/icons/stripe.svg" alt="Stripe" />
              <img src="/icons/visa.svg" alt="Visa" />
              <img src="/icons/mastercard.svg" alt="Mastercard" />
              <img src="/icons/paypal.svg" alt="PayPal" />
            </div>
            <p className="secure-payment">
              <svg className="lock-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Secure payment processing
            </p>
          </div>
        </motion.div>

        <div className="faq-section">
          <h3>Frequently Asked Questions</h3>
          <div className="faq-item">
            <button className="faq-question">
              What payment methods do you accept?
              <svg className="chevron-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="faq-answer">
              We accept all major credit/debit cards (Visa, Mastercard, American Express), 
              net banking, UPI payments through Razorpay, and international payments 
              through Stripe.
            </div>
          </div>
          {/* More FAQ items */}
        </div>
      </div>
    </div>
  );
};

// Stripe Checkout Form Component
const CheckoutForm = ({ plan, amount, description }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setPaymentError('');

    try {
      // Create payment intent on your server
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency: 'inr',
          description: `${description} Plan`,
        }),
      });

      const { clientSecret } = await response.json();

      // Confirm the payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });

      if (error) {
        setPaymentError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        // Payment succeeded - redirect to success page or show success message
        window.location.href = `/payment-success?pid=${paymentIntent.id}`;
      }
    } catch (err) {
      console.error('Payment error:', err);
      setPaymentError('An error occurred during payment processing');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
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

      {paymentError && <div className="payment-error">{paymentError}</div>}

      <button 
        className="purchase-btn btn-red"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? 'Processing...' : `Purchase ${plan === 'single' ? 'for ₹99' : 'Now'}`}
      </button>
    </form>
  );
};

export default Pricing;