import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useSnackbar } from 'notistack';
import Header from '../components/home/Header';
import Spinner from '../components/Spinner';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile, fetchUserProfile } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });

  // Fetch fresh user data when the component mounts - ONLY ONCE
  useEffect(() => {
    const loadUserProfile = async () => {
      setIsLoading(true);
      console.log("Fetching user profile data...");
      const result = await fetchUserProfile();
      console.log("Fetch result:", result);
      
      if (!result.success) {
        enqueueSnackbar(result.message, { variant: 'error' });
      }
      setIsLoading(false);
    };
    
    loadUserProfile();
    // Remove fetchUserProfile from dependencies to prevent infinite loop
  }, [enqueueSnackbar]); // Only depend on enqueueSnackbar, not fetchUserProfile

  // Update the form when user data changes
  useEffect(() => {
    console.log("User data received in Profile:", user);
    
    if (user) {
      // Ensure address is an object even if it's null or undefined in the user data
      const address = user.address || {};
      
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
        confirmPassword: '',
        address: {
          street: address.street || '',
          city: address.city || '',
          state: address.state || '',
          zipCode: address.zipCode || ''
        }
      });
    }
  }, [user]);

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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      enqueueSnackbar('Passwords do not match', { variant: 'error' });
      return;
    }

    // Only send password if it was filled in
    const updateData = { ...formData };
    if (!updateData.password) delete updateData.password;
    if (updateData.confirmPassword) delete updateData.confirmPassword;

    setIsSubmitting(true);
    const result = await updateProfile(updateData);
    setIsSubmitting(false);

    if (result.success) {
      enqueueSnackbar('Profile updated successfully', { variant: 'success' });
      // Reset password fields
      setFormData({
        ...formData,
        password: '',
        confirmPassword: ''
      });
    } else {
      enqueueSnackbar(result.message, { variant: 'error' });
    }
  };

  // Function to get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return '?';
    return user.name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="profile-container">
      <Header searchTerm="" setSearchTerm={() => {}} cartCount={0} />
      
      <div className="profile-card">
        <div className="profile-header">
          <h2 className="profile-title">My Profile</h2>
          <Link to="/" className="back-button">
            <i className="fas fa-arrow-left"></i>
            Back to Home
          </Link>
        </div>
        
        {isLoading ? (
          <div className="loading-container">
            <Spinner />
          </div>
        ) : (
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="avatar-section">
              <div className="avatar-circle">
                {getUserInitials()}
              </div>
              <div className="avatar-info">
                <div className="avatar-name">{user?.name}</div>
                <div className="avatar-email">{user?.email}</div>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone</label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address.street" className="form-label">Street Address</label>
                <input
                  type="text"
                  name="address.street"
                  id="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address.city" className="form-label">City</label>
                <input
                  type="text"
                  name="address.city"
                  id="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address.state" className="form-label">State</label>
                <input
                  type="text"
                  name="address.state"
                  id="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address.zipCode" className="form-label">Zip Code</label>
                <input
                  type="text"
                  name="address.zipCode"
                  id="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="password-section">
                <h3>Change Password</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="password" className="form-label">New Password</label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                disabled={isSubmitting}
                className="update-button"
              >
                {isSubmitting ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
