import React, { useState } from 'react';
import { FiPackage, FiUser, FiMail, FiAlertCircle, FiCheckCircle, FiArrowRight, FiInfo } from 'react-icons/fi';

const DeliveryForm = () => {
  const [formData, setFormData] = useState({
    orderId: '',
    fullName: '',
    email: '',
    reason: '',
    otherReason: '',
    details: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtherReason, setShowOtherReason] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.orderId) newErrors.orderId = 'Order ID is required';
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email address is invalid';
    if (!formData.reason) newErrors.reason = 'Reason for return is required';
    if (formData.reason === 'other' && !formData.otherReason) newErrors.otherReason = 'Please specify the reason';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'reason') {
      setShowOtherReason(value === 'other');
    }
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmissionStatus('success');
        setFormData({
          orderId: '',
          fullName: '',
          email: '',
          reason: '',
          otherReason: '',
          details: ''
        });
        setShowOtherReason(false);
        setTimeout(() => setSubmissionStatus(null), 3000);
      }, 2000);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg mx-auto my-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <FiPackage className="text-2xl text-green-600" style={{ color: '#18A558' }} />
        <h3 className="text-xl font-semibold text-gray-800">Request a Return/Refund</h3>
      </div>
      <p className="text-gray-600 text-sm mb-6">
        Fill out the details below to submit your return or refund request. We'll process it as soon as possible.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Order ID */}
        <div className="mb-5 relative">
          <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
            <FiPackage className="text-gray-500" />
            Order ID
            <span className="text-red-500">*</span>
            <div className="relative group">
              <FiInfo className="text-gray-400 ml-1 cursor-pointer" />
              <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg py-1 px-2 -top-10 left-0 z-10">
                Find your Order ID in your order confirmation email
              </div>
            </div>
          </label>
          <input
            type="text"
            name="orderId"
            value={formData.orderId}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ${
              errors.orderId
                ? 'border-red-500 focus:ring-red-300'
                : 'border-gray-300 focus:ring-green-300 focus:border-green-500'
            } placeholder-gray-400`}
            placeholder="e.g., ORD123456"
          />
          {errors.orderId && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-fade-in">
              <FiAlertCircle /> {errors.orderId}
            </p>
          )}
        </div>

        {/* Full Name */}
        <div className="mb-5">
          <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
            <FiUser className="text-gray-500" />
            Full Name
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ${
              errors.fullName
                ? 'border-red-500 focus:ring-red-300'
                : 'border-gray-300 focus:ring-green-300 focus:border-green-500'
            } placeholder-gray-400`}
            placeholder="Enter your full name"
          />
          {errors.fullName && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-fade-in">
              <FiAlertCircle /> {errors.fullName}
            </p>
          )}
        </div>

        {/* Email Address */}
        <div className="mb-5">
          <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
            <FiMail className="text-gray-500" />
            Email Address
            <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ${
              errors.email
                ? 'border-red-500 focus:ring-red-300'
                : 'border-gray-300 focus:ring-green-300 focus:border-green-500'
            } placeholder-gray-400`}
            placeholder="Enter your email address"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-fade-in">
              <FiAlertCircle /> {errors.email}
            </p>
          )}
        </div>

        {/* Reason for Return */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason for Return
            <span className="text-red-500">*</span>
          </label>
          <select
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ${
              errors.reason
                ? 'border-red-500 focus:ring-red-300'
                : 'border-gray-300 focus:ring-green-300 focus:border-green-500'
            }`}
          >
            <option value="">Select a reason</option>
            <option value="damaged">Damaged Item</option>
            <option value="wrong">Wrong Item Received</option>
            <option value="not-needed">Not Needed Anymore</option>
            <option value="quality">Quality Issue</option>
            <option value="other">Other</option>
          </select>
          {errors.reason && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-fade-in">
              <FiAlertCircle /> {errors.reason}
            </p>
          )}
        </div>

        {/* Other Reason (Conditional) */}
        {showOtherReason && (
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specify Reason
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="otherReason"
              value={formData.otherReason}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ${
                errors.otherReason
                  ? 'border-red-500 focus:ring-red-300'
                  : 'border-gray-300 focus:ring-green-300 focus:border-green-500'
              } placeholder-gray-400`}
              placeholder="Please specify your reason"
            />
            {errors.otherReason && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-fade-in">
                <FiAlertCircle /> {errors.otherReason}
              </p>
            )}
          </div>
        )}

        {/* Additional Details */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Details (Optional)
          </label>
          <textarea
            name="details"
            value={formData.details}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500 transition-all duration-200 min-h-[120px] resize-y"
            placeholder="Include any details to help us process your request faster (e.g., photos, specific issues)"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-white transition-all duration-200 ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-600 to-green-400 hover:from-green-700 hover:to-green-500'
          }`}
          style={{
            background: isSubmitting ? '#9CA3AF' : 'linear-gradient(to right, #18A558, #A3EBB1)',
          }}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Submitting...
            </>
          ) : (
            <>
              <FiCheckCircle />
              Submit Request
              <FiArrowRight />
            </>
          )}
        </button>
      </form>

      {/* Submission Status Toast */}
      {submissionStatus === 'success' && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <FiCheckCircle className="text-lg" />
          <span>Your request has been submitted successfully!</span>
        </div>
      )}
    </div>
  );
};

export default DeliveryForm;