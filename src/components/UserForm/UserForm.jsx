import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
 AiOutlineSave, 
 AiOutlineClose, 
 AiOutlineEye, 
 AiOutlineEyeInvisible 
} from 'react-icons/ai';
import { createUser, updateUser } from '../../services/users';
import { ROLES } from '../../utils/constants';
import './UserForm.css';
import Button from '../Button/Button';
import Input from '../Input/Input';

const UserForm = ({ user = null, mode = 'new', onSave, onCancel }) => {
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState('');
 const [showPassword, setShowPassword] = useState(false);
 const [generatePassword, setGeneratePassword] = useState(mode === 'new');
 
 const validationSchema = Yup.object({
   name: Yup.string()
     .required('Name is required')
     .min(3, 'Name must be at least 3 characters'),
   email: Yup.string()
     .email('Invalid email format')
     .required('Email is required'),
   password: mode === 'new' && !generatePassword 
     ? Yup.string()
         .required('Password is required')
         .min(6, 'Password must be at least 6 characters')
     : Yup.string(),
   role: Yup.string()
     .required('Role is required')
     .oneOf(Object.values(ROLES), 'Invalid role')
 });
 
 const formik = useFormik({
   initialValues: {
     name: user?.name || '',
     email: user?.email || '',
     password: '',
     role: user?.role || ROLES.USER
   },
   validationSchema,
   onSubmit: async (values) => {
     setLoading(true);
     setError('');
     
     try {
       if (mode === 'new' && generatePassword) {
         values.generatePassword = true;
         values.password = null;
       }
       
       if (mode === 'new') {
         await createUser(values);
       } else {
         const dataToUpdate = { ...values };
         if (!dataToUpdate.password) {
           delete dataToUpdate.password;
         }
         await updateUser(user.id, dataToUpdate);
       }
       
       if (onSave) {
         onSave();
       }
     } catch (err) {
       console.error('Error saving user:', err);
       setError(err.response?.data?.message || 'Error saving user');
     } finally {
       setLoading(false);
     }
   }
 });
 
 const toggleShowPassword = () => setShowPassword(prev => !prev);
 
 const toggleGeneratePassword = () => {
   setGeneratePassword(prev => !prev);
   if (!generatePassword) {
     formik.setFieldValue('password', '');
   }
 };
 
 return (
   <form onSubmit={formik.handleSubmit} className="user-form">
     <Input
       id="name"
       name="name"
       label="Name"
       value={formik.values.name}
       onChange={formik.handleChange}
       onBlur={formik.handleBlur}
       error={formik.errors.name}
       touched={formik.touched.name}
     />
     
     <Input
       type="email"
       id="email"
       name="email"
       label="Email"
       value={formik.values.email}
       onChange={formik.handleChange}
       onBlur={formik.handleBlur}
       error={formik.errors.email}
       touched={formik.touched.email}
     />
     
     {(mode === 'new' || !generatePassword) && (
       <>
         {mode === 'new' && (
           <div className="toggle-container">
             <label htmlFor="generate-password">Generate automatic password</label>
             <div className="toggle-wrapper">
               <input
                 type="checkbox"
                 id="generate-password"
                 className="toggle-input"
                 checked={generatePassword}
                 onChange={toggleGeneratePassword}
               />
               <label htmlFor="generate-password" className="toggle-label"></label>
             </div>
           </div>
         )}
         
         {!generatePassword && (
           <div className="form-group">
             <label className="form-label" htmlFor="password">
               {mode === 'new' ? 'Password' : 'New password (leave blank to keep current)'}
             </label>
             <div className="password-container">
               <input
                 type={showPassword ? 'text' : 'password'}
                 id="password"
                 name="password"
                 className={`form-input ${formik.touched.password && formik.errors.password ? 'invalid' : ''}`}
                 value={formik.values.password}
                 onChange={formik.handleChange}
                 onBlur={formik.handleBlur}
               />
               <button
                 type="button"
                 className="password-toggle"
                 onClick={toggleShowPassword}
               >
                 {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
               </button>
             </div>
             {formik.touched.password && formik.errors.password && (
               <div className="error-text">
                 {formik.errors.password}
               </div>
             )}
           </div>
         )}
       </>
     )}
     
     <div className="form-group">
       <label className="form-label" htmlFor="role">Role</label>
       <select
         id="role"
         name="role"
         className={`form-select ${formik.touched.role && formik.errors.role ? 'invalid' : ''}`}
         value={formik.values.role}
         onChange={formik.handleChange}
         onBlur={formik.handleBlur}
       >
         <option value={ROLES.USER}>User</option>
         <option value={ROLES.ADMIN}>Administrator</option>
       </select>
       {formik.touched.role && formik.errors.role && (
         <div className="error-text">
           {formik.errors.role}
         </div>
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
         onClick={onCancel}
         icon={<AiOutlineClose />}
       >
         Cancel
       </Button>
       <Button 
         type="submit" 
         variant="primary" 
         disabled={loading}
         icon={loading ? <div className="spinner"></div> : <AiOutlineSave />}
       >
         Save
       </Button>
     </div>
   </form>
 );
};

export default UserForm;