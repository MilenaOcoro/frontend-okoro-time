import React, { useState } from 'react';
import { useNavigate } from "react-router"; 
import { useFormik } from 'formik';
import * as Yup from 'yup'; 
import './LoginPage.css';
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineLogin } from 'react-icons/ai';
import * as authService from '../../services/authService';

const LoginPage = () => { 
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Validation schema with Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
  });

  // Formik configuration
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      
      try { 
        const result = await authService.login(values);
        
        if (result.success) { 
          if (result.role === 'ADMIN') {
            navigate('/dashboardAdmin');
          } else { 
            navigate('/dashboard');
          }
        } else {
          setError(result.error || 'Login error');
        }
      } catch (err) {
        setError('Server error. Please try again later.');
        console.error('Login error:', err);
      } finally {
        setLoading(false);
      }
    }
  });

  const toggleShowPassword = () => setShowPassword(prev => !prev);
  
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="logo-container">
            <div className="logo">
              <img src="/logo-okoro.svg" alt="Okoro Time Logo" />
            </div>
          </div>
          
          <form onSubmit={formik.handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                className={`form-input ${formik.touched.email && formik.errors.email ? 'invalid' : ''}`}
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="error-text">{formik.errors.email}</div>
              )}
            </div>

            <div className="form-group">
              <div className="password-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Password"
                  className={`form-input ${formik.touched.password && formik.errors.password ? 'invalid' : ''}`}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={toggleShowPassword}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <div className="error-text">{formik.errors.password}</div>
              )}
            </div>

            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  <span className="login-icon"><AiOutlineLogin /></span>
                  <span>Login</span>
                </>
              )}
            </button>
          </form>
          
          <div className="register-link">
            <a onClick={() => navigate('/register-user')}>Register</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;