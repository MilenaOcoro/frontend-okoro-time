import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import { createClockRecord } from '../../services/timeEntries';
import { useAuth } from '../../hooks/useAuth';
import './TimeEntryForm.css';
import Card from '../Card/Card';
import Button from '../Button/Button';

const TimeEntryForm = ({ onSuccess, suggestedType }) => {
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState('');
 const [entryType, setEntryType] = useState(suggestedType || 'clock_in');
 const [manualMode, setManualMode] = useState(false);

 const validationSchema = Yup.object({
   date: Yup.date()
     .required('Date is required'),
   time: Yup.string()
     .required('Time is required'),
   comments: Yup.string()
     .max(200, 'Comment cannot exceed 200 characters')
 });

 const formik = useFormik({
   initialValues: {
     date: moment().format('YYYY-MM-DD'),
     time: moment().format('HH:mm'),
     comments: ''
   },
   validationSchema,
   onSubmit: async (values) => {
     setLoading(true);
     setError('');
     
     try { 
       const clockRecordData = {
         type: entryType,
         date: values.date,
         time: values.time,
         comments: values.comments,
         manual: manualMode
       };
       
       await createClockRecord(clockRecordData);
        
       formik.resetForm();
       
       if (onSuccess) {
         onSuccess(entryType);
       }
     } catch (err) {
       console.error('Error recording clock entry:', err);
       setError(err.response?.data?.message || 'Error recording clock entry');
     } finally {
       setLoading(false);
     }
   }
 });
 
 const handleEntryTypeChange = (e) => {
   setEntryType(e.target.value);
 };
 
 const toggleManualMode = () => {
   setManualMode(!manualMode);
   
   if (manualMode) {
     formik.setFieldValue('date', moment().format('YYYY-MM-DD'));
     formik.setFieldValue('time', moment().format('HH:mm'));
   }
 };

 const handleDateChange = (e) => {
   formik.setFieldValue('date', e.target.value);
 };
 
 const handleTimeChange = (e) => {
   formik.setFieldValue('time', e.target.value);
 };

 return (
   <div className="time-entry-form">
     <Card title={`${entryType === 'clock_in' ? 'Clock In' : 'Clock Out'}`}>
       <form onSubmit={formik.handleSubmit}>
         <div className="segment-container">
           <div className="segment" role="radiogroup">
             <button 
               type="button"
               className={`segment-button ${entryType === 'clock_in' ? 'segment-button-checked' : ''}`}
               value="clock_in"
               onClick={handleEntryTypeChange}
             >
               Clock In
             </button>
             <button 
               type="button"
               className={`segment-button ${entryType === 'clock_out' ? 'segment-button-checked' : ''}`}
               value="clock_out"
               onClick={handleEntryTypeChange}
             >
               Clock Out
             </button>
           </div>
         </div>
         
         <div className="mode-selector">
           <button 
             type="button"
             className={`mode-button ${manualMode ? 'mode-button-outline' : 'mode-button-solid'}`}
             onClick={toggleManualMode}
           >
             {manualMode ? 'Manual Mode' : 'Current Time'}
           </button>
         </div>

         {manualMode && (
           <div className="datetime-inline-container">
             <div className="form-group">
               <label htmlFor="date" className="form-label">Date</label>
               <input
                 id="date"
                 type="date"
                 className="form-input"
                 value={formik.values.date}
                 onChange={handleDateChange}
               />
             </div>
             <div className="form-group">
               <label htmlFor="time" className="form-label">Time</label>
               <input
                 id="time"
                 type="time"
                 className="form-input"
                 value={formik.values.time}
                 onChange={handleTimeChange}
               />
             </div>
           </div>
         )}

         <div className="form-group">
           <label htmlFor="comments" className="form-label">Comments (optional)</label>
           <textarea
             id="comments"
             name="comments"
             className={`form-textarea ${formik.touched.comments && formik.errors.comments ? 'invalid' : ''}`}
             value={formik.values.comments}
             onChange={formik.handleChange}
             onBlur={formik.handleBlur}
             rows={3}
             maxLength={200}
           />
           {formik.touched.comments && formik.errors.comments && (
             <div className="error-text">
               {formik.errors.comments}
             </div>
           )}
         </div>

         {error && (
           <div className="error-message">
             <p>{error}</p>
           </div>
         )}

         <Button
           type="submit"
           variant="primary"
           disabled={loading}
           className="w-100"
         >
           {loading ? (
             <div className="spinner"></div>
           ) : (
             `Record ${entryType === 'clock_in' ? 'Clock In' : 'Clock Out'}`
           )}
         </Button>
       </form>
     </Card>
   </div>
 );
};

export default TimeEntryForm;