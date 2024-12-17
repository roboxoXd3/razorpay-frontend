"use client";
import Image from "next/image";
import axios from 'axios';
import { useState } from 'react';
import { RazorpayOrderOptions, useRazorpay } from 'react-razorpay';
import Razorpay from "react-razorpay/dist/razorpay";

export default function Home() {

  // Initialize Razorpay hook from react-razorpay library
  const razorpay = useRazorpay();

  // State to store payment amount in paise (₹699 = 69900 paise)
  const [amount, setAmount] = useState(69900);

  /**
   * Handles completing the payment by sending payment details to backend
   * 
   * @param payment_id - Unique payment ID from Razorpay (e.g. pay_29QQoUBi66xm2f)
   * @param order_id - Razorpay order ID (e.g. order_JkVtugqb6axZp8) 
   * @param signature - Payment signature for verification
   */
  const completePayment = (payment_id: string, order_id: string, signature: string) => {
    // Make POST request to backend API to record successful payment
    axios.post('http://localhost:8000/razorpay/order-complete/', {
      order_id: order_id,
      payment_id: payment_id, 
      signature: signature,
      amount: amount  // Amount in paise
    }).then(response => {
      console.log(response.data.data);
      const order_id = response.data.data.id;
      console.log(order_id);
    })
    .catch(error => {
      console.log(error.response);
    });
  }

  /**
   * Initiates the Razorpay payment flow
   * 
   * Flow:
   * 1. Creates order on backend
   * 2. Gets order ID from backend
   * 3. Opens Razorpay payment modal
   * 4. Handles payment success/failure
   */
  const handleRazorpayPayment = () => {
    // First create order on backend
    axios.post('http://localhost:8000/razorpay/create-order/', {
      amount: amount,  // Amount in paise
      currency: 'INR'
    })
    .then(response => {
      console.log(response.data.data);
      const order_id = response.data.data.id;
      console.log(order_id);
      
      // Configure options for Razorpay payment modal
      const options: RazorpayOrderOptions = {
        key: "rzp_test_o25MnaJSzjS2RW", // Your Razorpay API key
        amount: amount, // Amount in paise
        currency: "INR",
        name: "Rian Infotech", // Your business name
        description: "Making your life easier",
        order_id: order_id, // Order ID from backend
        // Handler called on successful payment
        handler: (response) => {
          console.log(response);
          alert(response.razorpay_payment_id);
          alert(response.razorpay_order_id);
          alert(response.razorpay_signature);
          // Record successful payment
          completePayment(
            response.razorpay_payment_id,
            response.razorpay_order_id,
            response.razorpay_signature
          );
        },
        // Pre-fill customer details
        prefill: {
          name: "roboxo",
          email: "roboxo@gmail.com",
          contact: "9999999999",
        },
        // Customize theme
        theme: {
          color: "#F37254",
        },
      };
  
      // Create new Razorpay instance with options
      const razorpayInstance = new Razorpay(options);
      
      // Handle payment failures
      razorpayInstance.on('payment.failed', (response) => {
        console.log(response);
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.payment_id);
        alert(response.error.metadata.order_id);
      });

      // Open Razorpay payment modal
      razorpayInstance.open();

    })
    .catch(error => {
      console.log(error);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
            Choose Your Membership Plan
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Join thousands of happy members and start your journey today
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Basic Plan */}
          <div className="relative rounded-2xl bg-white dark:bg-gray-800 shadow-lg p-8 border border-gray-200 dark:border-gray-700 transition-transform hover:-translate-y-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic</h3>
            <p className="mt-4 text-gray-500 dark:text-gray-400">Perfect for getting started</p>
            <div className="mt-6">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">₹699</span>
              <span className="text-gray-500 dark:text-gray-400">/month</span>
            </div>
            <ul className="mt-8 space-y-4">
              {['5 Projects', '2GB Storage', 'Basic Support'].map((feature) => (
                <li key={feature} className="flex items-center">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span className="ml-3 text-gray-600 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            <button onClick={handleRazorpayPayment} className="mt-8 w-full rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              Get Started
            </button>
          </div>

          {/* Pro Plan */}
          <div className="relative rounded-2xl bg-gradient-to-b from-blue-600 to-blue-700 shadow-lg p-8 border border-blue-500 transition-transform hover:-translate-y-1">
            <div className="absolute top-0 right-6 -translate-y-1/2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-400 text-gray-900">
                Popular
              </span>
            </div>
            <h3 className="text-lg font-semibold text-white">Pro</h3>
            <p className="mt-4 text-blue-100">Best for professionals</p>
            <div className="mt-6">
              <span className="text-4xl font-bold text-white">₹1,999</span>
              <span className="text-blue-100">/month</span>
            </div>
            <ul className="mt-8 space-y-4">
              {['Unlimited Projects', '10GB Storage', 'Priority Support', 'Advanced Analytics'].map((feature) => (
                <li key={feature} className="flex items-center">
                  <svg className="w-5 h-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span className="ml-3 text-white">{feature}</span>
                </li>
              ))}
            </ul>
            <button className="mt-8 w-full rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors">
              Get Started
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="relative rounded-2xl bg-white dark:bg-gray-800 shadow-lg p-8 border border-gray-200 dark:border-gray-700 transition-transform hover:-translate-y-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Enterprise</h3>
            <p className="mt-4 text-gray-500 dark:text-gray-400">For large organizations</p>
            <div className="mt-6">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">₹7,499</span>
              <span className="text-gray-500 dark:text-gray-400">/month</span>
            </div>
            <ul className="mt-8 space-y-4">
              {['Unlimited Everything', 'Custom Support', 'API Access', 'Custom Integration'].map((feature) => (
                <li key={feature} className="flex items-center">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span className="ml-3 text-gray-600 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            <button className="mt-8 w-full rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Have questions? We're here to help.
          </p>
        </div>
      </div>
    </div>
  );
}
