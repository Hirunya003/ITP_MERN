import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useSnackbar } from 'notistack';
import '../../styles/forms.css';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });
  
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, user } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    if (e.target.name.includes('.')) {
      const [parent, child] = e.target.name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: e.target.value
        }
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
      
      // Check password strength when password field changes
      if (e.target.name === 'password') {
        checkPasswordStrength(e.target.value);
      }
    }
  };

  const checkPasswordStrength = (password) => {
    if (password.length === 0) {
      setPasswordStrength('');
      return;
    }
    
    if (password.length < 6) {
      setPasswordStrength('weak');
      return;
    }
    
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (password.length >= 8 && hasLower && hasUpper && hasNumber && hasSpecial) {
      setPasswordStrength('strong');
    } else if (password.length >= 6 && (hasLower || hasUpper) && (hasNumber || hasSpecial)) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('weak');
    }
  };
  
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      enqueueSnackbar('Passwords do not match', { variant: 'error' });
      return;
    }

    setIsSubmitting(true);
    
    const result = await register(formData);
    
    setIsSubmitting(false);
    
    if (result.success) {
      enqueueSnackbar('Registration successful!', { variant: 'success' });
      navigate('/');
    } else {
      enqueueSnackbar(result.message, { variant: 'error' });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container register-form-container">
        <div className="register-form-header">
          <h2 className="auth-title">Create your Account</h2>
          <p className="auth-subtitle">Join us and start shopping with ease</p>
        </div>
        
        {/* Progress indicator */}
        <div className="progress-steps">
          <div className="progress-step complete">1</div>
          <div className="progress-step active">2</div>
          <div className="progress-step">3</div>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-input"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                name="password"
                type={passwordVisible ? "text" : "password"}
                className="form-input"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span className="field-icon" onClick={togglePasswordVisibility}>
                <i className={passwordVisible ? "fas fa-eye-slash" : "fas fa-eye"}></i>
              </span>
            </div>
            
            {passwordStrength && (
              <div className="password-strength">
                <div className="strength-meter">
                  <div className={`strength-meter-fill strength-${passwordStrength}`}></div>
                </div>
                <div style={{ marginTop: '5px', fontSize: '0.75rem' }}>
                  Password strength: <span style={{ fontWeight: '600', textTransform: 'capitalize' }}>{passwordStrength}</span>
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={confirmPasswordVisible ? "text" : "password"}
                className="form-input"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <span className="field-icon" onClick={toggleConfirmPasswordVisibility}>
                <i className={confirmPasswordVisible ? "fas fa-eye-slash" : "fas fa-eye"}></i>
              </span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="text"
              className="form-input"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="address-section">
            <h3 className="address-section-title">Delivery Address</h3>
            
            <div className="form-group">
              <label htmlFor="address.street" className="form-label">Street Address</label>
              <input
                id="address.street"
                name="address.street"
                type="text"
                className="form-input"
                placeholder="Enter your street address"
                value={formData.address.street}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="address.city" className="form-label">City</label>
                <input
                  id="address.city"
                  name="address.city"
                  type="text"
                  className="form-input"
                  placeholder="City"
                  value={formData.address.city}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="address.state" className="form-label">State</label>
                <input
                  id="address.state"
                  name="address.state"
                  type="text"
                  className="form-input"
                  placeholder="State"
                  value={formData.address.state}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address.zipCode" className="form-label">Zip Code</label>
              <input
                id="address.zipCode"
                name="address.zipCode"
                type="text"
                className="form-input"
                placeholder="Zip Code"
                value={formData.address.zipCode}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="form-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

