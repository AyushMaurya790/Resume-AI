// src/context/PaymentContext.jsx
import React, { createContext, useState } from 'react';

export const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [paymentStatus, setPaymentStatus] = useState('pending');

  return (
    <PaymentContext.Provider value={{ paymentStatus, setPaymentStatus }}>
      {children}
    </PaymentContext.Provider>
  );
};