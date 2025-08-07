import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PaymentModal from './PaymentModal';
import '../../styles/Pricing.css';

const Pricing = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

  const plans = [
    {
      id: 'basic',
      name: 'Single Resume',
      price: 99,
      features: [
        '1 Premium Resume',
        'AI Content Generation',
        '25+ Templates',
        'PDF Download',
        'Watermark Removal'
      ],
      color: 'blue'
    },
    {
      id: 'pro',
      name: 'Resume Pack',
      price: 249,
      features: [
        '3 Premium Resumes',
        'Priority AI Generation',
        'All Templates',
        'Cover Letter Included',
        'ATS Score Check'
      ],
      color: 'red',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Unlimited',
      price: 499,
      features: [
        'Unlimited Resumes',
        'All AI Features',
        'Team Sharing',
        'Resume Wallet',
        'Priority Support'
      ],
      color: 'blue'
    }
  ];

  const applyPromoCode = () => {
    // Validate and apply promo code
    const validPromos = {
      'RESUME25': 0.25,
      'AI50': 0.5,
      'HIRING2025': 0.3
    };

    if (promoCode in validPromos) {
      setAppliedPromo({
        code: promoCode,
        discount: validPromos[promoCode]
      });
    }
  };

  const calculateDiscountedPrice = (price) => {
    if (!appliedPromo) return price;
    return Math.floor(price * (1 - appliedPromo.discount));
  };

  const openPaymentModal = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <div className="pricing-container">
      <div className="pricing-header">
        <h1>
          <span className="text-red">Unlock</span>{' '}
          <span className="text-blue">Premium</span> Features
        </h1>
        <p>Choose the plan that fits your needs and start building standout resumes</p>
        
        <div className="promo-code-section">
          <input
            type="text"
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            className="promo-input"
          />
          <button 
            onClick={applyPromoCode}
            className="promo-apply-btn btn-red"
          >
            Apply
          </button>
        </div>
        {appliedPromo && (
          <div className="promo-success">
            Promo code applied! {appliedPromo.discount * 100}% off
          </div>
        )}
      </div>

      <div className="pricing-grid">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            className={`pricing-card ${plan.popular ? 'popular' : ''}`}
            whileHover={{ y: -10 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {plan.popular && (
              <div className="popular-badge">Most Popular</div>
            )}
            
            <div className={`plan-header bg-${plan.color}`}>
              <h3>{plan.name}</h3>
              <div className="price">
                <span className="currency">₹</span>
                {calculateDiscountedPrice(plan.price)}
                {appliedPromo && (
                  <span className="original-price">₹{plan.price}</span>
                )}
              </div>
            </div>
            
            <ul className="features-list">
              {plan.features.map((feature, index) => (
                <li key={index}>
                  <svg className="check-icon">{/* Checkmark SVG */}</svg>
                  {feature}
                </li>
              ))}
            </ul>
            
            <button
              className={`select-plan-btn btn-${plan.color}`}
              onClick={() => openPaymentModal(plan)}
            >
              Get Started
            </button>
          </motion.div>
        ))}
      </div>

      {isModalOpen && (
        <PaymentModal
          plan={selectedPlan}
          discount={appliedPromo?.discount || 0}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Pricing;