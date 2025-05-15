import React from 'react';
import { Link } from 'react-router-dom';
import DeliveryForm from '../components/delivary manager/DeliveryForm';

const RefundPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Navigation Bar */}
      <nav className="flex gap-3 p-3 bg-white border-b border-gray-200 mb-6 rounded-lg shadow-sm">
        <Link to="/delivery" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200">
          Dashboard
        </Link>
        <Link to="/delivery" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200">
          Delivery
        </Link>
        <Link to="/support" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200">
          Contact Support
        </Link>
      </nav>

      {/* Refund Item Section */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-green-600 border-b-2 border-green-600 inline-block mb-2">
          REFUND ITEM
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          Submit a return or refund request for a delivered order
        </p>
        <DeliveryForm />
      </section>
    </div>
  );
};

export default RefundPage; 