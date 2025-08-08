import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Helmet } from 'react-helmet';
import { Button, Typography } from '@mui/material';
import '../styles/PricingStyles.css';

// Stripe promise (replace with your publishable key)
const stripePromise = loadStripe('your_stripe_publishable_key');

// Razorpay script loader
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState('single');
  const [promoCode, setPromoCode] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [aiRecommendation, setAiRecommendation] = useState(null);

  const plans = {
    single: {
      name: 'Single Resume',
      price: 99,
      discountedPrice: 99,
      features: [
        '1 Premium Resume',
        'AI-Generated Content',
        '25+ Templates',
        'PDF Download',
        'Shareable Link',
        'Resume Score Analysis',
      ],
      cta: 'Get Your Resume',
      aiScore: 80,
    },
    pro: {
      name: 'Pro Package',
      price: 299,
      discountedPrice: 249,
      features: [
        '5 Premium Resumes',
        'Priority AI Generation',
        'All Templates',
        'Cover Letters Included',
        'ATS Optimization',
        'Job Match Scoring',
      ],
      cta: 'Go Pro',
      aiScore: 90,
    },
    unlimited: {
      name: 'Unlimited',
      price: 999,
      discountedPrice: 799,
      features: [
        'Unlimited Resumes',
        'Team Sharing',
        'Resume Wallet',
        'Dedicated Support',
        'Advanced Analytics',
        'Early Access to Features',
      ],
      cta: 'Get Unlimited',
      aiScore: 95,
    },
  };

  // Simulate AI-driven plan recommendation
  useEffect(() => {
    // Mock GPT-4o recommendation based on user needs (e.g., from ResumeContext)
    const recommendedPlan = Object.keys(plans).reduce((prev, curr) =>
      plans[prev].aiScore > plans[curr].aiScore ? prev : curr
    );
    setAiRecommendation(recommendedPlan);
  }, []);

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
        const discount = selectedPlan === 'single' ? 24.75 : selectedPlan === 'pro' ? 62.25 : 199.75;
        plans[selectedPlan].discountedPrice = plans[selectedPlan].price - discount;
        setPromoSuccess('Promo code applied! Save up to 25%!');
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
    plans[plan].discountedPrice = plans[plan].price; // Reset discount
  };

  const handleRazorpayPayment = async () => {
    const razorpayLoaded = await loadRazorpay();
    if (!razorpayLoaded) {
      alert('Razorpay SDK failed to load. Please try again.');
      return;
    }

    try {
      const response = await fetch('/api/razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: plans[selectedPlan].discountedPrice * 100, // In paise
          currency: 'INR',
          plan: selectedPlan,
        }),
      });
      const { orderId } = await response.json();

      const options = {
        key: 'your_razorpay_key_id',
        amount: plans[selectedPlan].discountedPrice * 100,
        currency: 'INR',
        name: 'ResumeAI',
        description: `${plans[selectedPlan].name} Plan`,
        order_id: orderId,
        handler: (response) => {
          window.location.href = `/payment-success?pid=${response.razorpay_payment_id}`;
        },
        prefill: {
          name: 'User Name',
          email: 'user@example.com',
          contact: '1234567890',
        },
        theme: {
          color: '#3e6bff',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Razorpay error:', error);
      alert('An error occurred during payment processing');
    }
  };

  return (
    <div className="pricing-container">
      <Helmet>
        <title>ResumeAI - Pricing Plans</title>
        <meta
          name="description"
          content="Choose from affordable ResumeAI pricing plans starting at ₹99. Unlock premium resumes, AI-generated content, and ATS optimization."
        />
        <meta name="keywords" content="resume pricing, ResumeAI plans, AI resume builder" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'ResumeAI Pricing',
            description: 'Explore pricing plans for ResumeAI, including single, pro, and unlimited options.',
            url: window.location.href,
          })}
        </script>
      </Helmet>

      <motion.div
        className="pricing-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Typography variant="h1">
          <span className="text-red">Resume</span>
          <span className="text-blue">AI</span> Pricing
        </Typography>
        <Typography variant="body1" className="subtitle">
          Unlock your career potential with our flexible plans
        </Typography>
        {aiRecommendation && (
          <motion.div
            className="ai-recommendation"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Typography variant="body2">
              <strong>AI Recommendation:</strong> The "{plans[aiRecommendation].name}" plan is best for your needs (Score: {plans[aiRecommendation].aiScore}%).
            </Typography>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        className="pricing-tabs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {Object.keys(plans).map((plan) => (
          <motion.button
            key={plan}
            className={`tab-btn ${selectedPlan === plan ? `active btn-${plan === 'pro' ? 'blue' : 'red'}` : `btn-outline-${plan === 'pro' ? 'blue' : 'red'}`}`}
            onClick={() => handlePlanSelect(plan)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {plans[plan].name}
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedPlan}
          className="plan-card"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
        >
          <div className="plan-header">
            <Typography variant="h2">{plans[selectedPlan].name}</Typography>
            <div className="price-display">
              {plans[selectedPlan].discountedPrice < plans[selectedPlan].price && (
                <Typography variant="body1" className="original-price">
                  ₹{plans[selectedPlan].price}
                </Typography>
              )}
              <Typography variant="h3" className="current-price">
                ₹{plans[selectedPlan].discountedPrice}
              </Typography>
              {selectedPlan !== 'single' && (
                <Typography variant="body2" className="billing-cycle">
                  /year
                </Typography>
              )}
            </div>
          </div>

          <ul className="plan-features">
            {plans[selectedPlan].features.map((feature, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <svg className="feature-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {feature}
              </motion.li>
            ))}
          </ul>

          <div className="promo-section">
            <div className="promo-input-group">
              <input
                type="text"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className={promoError ? 'input-error' : ''}
                aria-label="Promo code"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleApplyPromo}
                disabled={isApplyingPromo}
                className="apply-promo"
              >
                {isApplyingPromo ? 'Applying...' : 'Apply'}
              </Button>
            </div>
            <AnimatePresence>
              {promoError && (
                <motion.div
                  className="promo-error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {promoError}
                </motion.div>
              )}
              {promoSuccess && (
                <motion.div
                  className="promo-success"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {promoSuccess}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="payment-options">
            <Elements stripe={stripePromise}>
              <CheckoutForm
                plan={selectedPlan}
                amount={plans[selectedPlan].discountedPrice * 100}
                description={plans[selectedPlan].name}
              />
            </Elements>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleRazorpayPayment}
              className="razorpay-btn"
            >
              Pay with Razorpay
            </Button>
          </div>

          <div className="payment-methods">
            <div className="payment-icons">
              <img src="/icons/razorpay.svg" alt="Razorpay" />
              <img src="/icons/stripe.svg" alt="Stripe" />
              <img src="/icons/visa.svg" alt="Visa" />
              <img src="/icons/mastercard.svg" alt="Mastercard" />
              <img src="/icons/paypal.svg" alt="PayPal" />
            </div>
            <Typography variant="body2" className="secure-payment">
              <svg className="lock-icon" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              Secure payment processing
            </Typography>
          </div>
        </motion.div>
      </AnimatePresence>

      <motion.div
        className="faq-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Typography variant="h3">Frequently Asked Questions</Typography>
        <div className="faq-item">
          <button className="faq-question">
            What payment methods do you accept?
            <svg className="chevron-icon" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <motion.div
            className="faq-answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            We accept all major credit/debit cards (Visa, Mastercard, American Express), net banking, UPI payments through Razorpay, and international payments through Stripe.
          </motion.div>
        </div>
      </motion.div>
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
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency: 'inr',
          description: `${description} Plan`,
        }),
      });

      const { clientSecret } = await response.json();

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (error) {
        setPaymentError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
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
                fontFamily: '"Inter", sans-serif',
                fontSize: '16px',
                color: '#1f2937',
                '::placeholder': { color: '#6b7280' },
              },
              invalid: { color: '#ff3e3e' },
            },
          }}
        />
      </div>
      {paymentError && (
        <motion.div
          className="payment-error"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {paymentError}
        </motion.div>
      )}
      <Button
        variant="contained"
        color="primary"
        disabled={!stripe || isProcessing}
        className="purchase-btn"
      >
        {isProcessing ? 'Processing...' : `Purchase ${plan === 'single' ? 'for ₹99' : 'Now'}`}
      </Button>
    </form>
  );
};

export default Pricing;