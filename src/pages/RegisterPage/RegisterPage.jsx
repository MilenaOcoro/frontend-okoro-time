import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AiOutlineUser, AiOutlineMail, AiOutlineLock, AiOutlineCheck } from 'react-icons/ai'; 
import { Navigate, useNavigate } from 'react-router-dom'; 
import './RegisterPage.css'; 
import { ROLES } from '../../utils/constants';
import { createUser } from '../../services/users';
import Main from '../../components/main/Main';
import Card from '../../components/Card/Card'; 
import Button from '../../components/Button/Button';

const RegisterPage = () => {
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState('');
 const [showToast, setShowToast] = useState(false);
 const [toastMessage, setToastMessage] = useState('');
 const [toastColor, setToastColor] = useState('success');
  
 const navigate = useNavigate(); 
  
 const validationSchema = Yup.object({
   name: Yup.string()
     .required('Name is required')
     .min(3, 'Name must be at least 3 characters')
     .max(50, 'Name must be maximum 50 characters'),
   email: Yup.string()
     .email('Invalid email')
     .required('Email is required'),
   password: Yup.string()
     .required('Password is required')
     .min(6, 'Password must be at least 6 characters'),
   confirmPassword: Yup.string()
     .oneOf([Yup.ref('password'), null], 'Passwords must match')
     .required('Confirm the password')
 });
 
 const formik = useFormik({
   initialValues: {
     name: '',
     email: '',
     password: '',
     confirmPassword: '',
     role: ROLES.USER
   },
   validationSchema,
   onSubmit: async (values) => { 
     setLoading(true);
     setError('');
     
     try { 
       const userData = {
         name: values.name,
         email: values.email,
         password: values.password,
         role: ROLES.USER
       };
        
       await createUser(userData);
        
       showToastMessage('User created successfully', 'success');
        
       setTimeout(() => {
         navigate('/users');
       }, 2000);
     } catch (err) {
       console.error('Error creating user:', err);
       setError(err.response?.data?.message || 'Error creating user');
     } finally {
       setLoading(false);
     }
   }
 });
 
 const showToastMessage = (message, color = 'success') => {
   setToastMessage(message);
   setToastColor(color);
   setShowToast(true);
   
   setTimeout(() => {
     setShowToast(false);
   }, 3000);
 };
 
 return (
   <Main>
     <main className="content-container">
       <div className="register-page">
         <div className="page-header">
           <h1>New User</h1>
         </div>
         
         <div className="grid-container">
           <div className="grid-row">
             <div className="grid-col">
               <Card title="Create User">
                 <form onSubmit={formik.handleSubmit}>
                   <div className="form-group">
                     <label htmlFor="name" className="form-label">
                       <AiOutlineUser className="form-icon" />
                       Full name
                     </label>
                     <input
                       id="name"
                       name="name"
                       type="text"
                       className={`form-input ${formik.touched.name && formik.errors.name ? 'invalid' : ''}`}
                       value={formik.values.name}
                       onChange={formik.handleChange}
                       onBlur={formik.handleBlur}
                     />
                     {formik.touched.name && formik.errors.name && (
                       <div className="error-text">{formik.errors.name}</div>
                     )}
                   </div>
                   
                   <div className="form-group">
                     <label htmlFor="email" className="form-label">
                       <AiOutlineMail className="form-icon" />
                       Email
                     </label>
                     <input
                       id="email"
                       name="email"
                       type="email"
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
                     <label htmlFor="password" className="form-label">
                       <AiOutlineLock className="form-icon" />
                       Password
                     </label>
                     <input
                       id="password"
                       name="password"
                       type="password"
                       className={`form-input ${formik.touched.password && formik.errors.password ? 'invalid' : ''}`}
                       value={formik.values.password}
                       onChange={formik.handleChange}
                       onBlur={formik.handleBlur}
                     />
                     {formik.touched.password && formik.errors.password && (
                       <div className="error-text">{formik.errors.password}</div>
                     )}
                   </div>
                   
                   <div className="form-group">
                     <label htmlFor="confirmPassword" className="form-label">
                       <AiOutlineCheck className="form-icon" />
                       Confirm password
                     </label>
                     <input
                       id="confirmPassword"
                       name="confirmPassword"
                       type="password"
                       className={`form-input ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'invalid' : ''}`}
                       value={formik.values.confirmPassword}
                       onChange={formik.handleChange}
                       onBlur={formik.handleBlur}
                     />
                     {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                       <div className="error-text">{formik.errors.confirmPassword}</div>
                     )}
                   </div>
                   
                   {error && (
                     <div className="error-message">
                       <p>{error}</p>
                     </div>
                   )}
                   
                   <div className="form-actions">
                     <Button
                       type="button"
                       variant="secondary"
                       onClick={() => navigate('/users')}
                     >
                       Cancel
                     </Button>
                     <Button
                       type="submit"
                       variant="primary"
                       disabled={loading}
                     >
                       {loading ? <div className="spinner"></div> : 'Create User'}
                     </Button>
                   </div>
                 </form>
               </Card>
             </div>
           </div>
         </div>
         
         {showToast && (
           <div className={`toast-container toast-${toastColor}`}>
             <p>{toastMessage}</p>
           </div>
         )}
       </div>
     </main>
   </Main>
 );
};

export default RegisterPage;