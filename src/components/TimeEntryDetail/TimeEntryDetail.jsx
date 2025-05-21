import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
 AiOutlineSave, 
 AiOutlineClose, 
 AiOutlineCalendar, 
 AiOutlineClockCircle, 
 AiOutlineDelete,
 AiOutlineEdit 
} from 'react-icons/ai';
import { updateClockRecord, deleteClockRecord } from '../../services/timeEntries';
import { useAuth } from '../../hooks/useAuth';
import moment from 'moment';
import { TIME_ENTRY_TYPES, DATE_FORMAT } from '../../utils/constants';
import './TimeEntryDetail.css';
import Button from '../Button/Button';

const TimeEntryDetail = ({ timeEntry, isAdmin = false, onSave, onCancel, onDelete }) => {
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState('');
 const [showDeleteAlert, setShowDeleteAlert] = useState(false);
 const [editMode, setEditMode] = useState(false);
 
 const { user } = useAuth();
 
 const canEdit = isAdmin || timeEntry.user_id === user.id;
 
 const validationSchema = Yup.object({
   type: Yup.string()
     .required('Type is required')
     .oneOf(Object.values(TIME_ENTRY_TYPES), 'Invalid type'),
   date: Yup.date()
     .required('The date is mandatory'),
   time: Yup.string()
     .required('The time is mandatory')
     .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, 'Invalid time format'),
   comments: Yup.string()
     .max(200, 'The comment cannot exceed 200 characters.')
 });
 
 const formik = useFormik({
   initialValues: {
     type: timeEntry.type || TIME_ENTRY_TYPES.CLOCK_IN,
     date: timeEntry.date || moment().format(DATE_FORMAT.API_DATE),
     time: timeEntry.time || moment().format(DATE_FORMAT.API_TIME),
     comments: timeEntry.comments || '',
     manual: timeEntry.manual || false
   },
   validationSchema,
   onSubmit: async (values) => {
     setLoading(true);
     setError('');
     
     try {
       await updateClockRecord(timeEntry.id, values);
       
       if (onSave) {
         onSave();
       }
     } catch (err) {
       console.error('Error updating clock record:', err);
       setError(err.response?.data?.message || 'Error updating clock record');
     } finally {
       setLoading(false);
     }
   }
 });
 
 const handleDateChange = (e) => {
   const formattedDate = moment(e.target.value).format(DATE_FORMAT.API_DATE);
   formik.setFieldValue('date', formattedDate);
 };
 
 const handleTimeChange = (e) => {
   const formattedTime = e.target.value + ':00';
   formik.setFieldValue('time', formattedTime);
 };
 
 const handleDelete = async () => {
   try {
     await deleteClockRecord(timeEntry.id);
     
     if (onDelete) {
       onDelete();
     }
   } catch (err) {
     console.error('Error deleting clock record:', err);
     setError(err.response?.data?.message || 'Error deleting clock record');
   }
 };
 
 const toggleEditMode = () => {
   setEditMode(!editMode);
 };
 
 const formatDate = (date) => {
   return date ? moment(date).format(DATE_FORMAT.DATE) : '--/--/----';
 };
 
 const formatTime = (time) => {
   return time ? moment(time, DATE_FORMAT.API_TIME).format(DATE_FORMAT.TIME) : '--:--';
 };
 
 return (
   <div className="time-entry-detail">
     {editMode ? (
       <form onSubmit={formik.handleSubmit} className="time-entry-form">
         <div className="form-group">
           <label htmlFor="type">Type</label>
           <select
             id="type"
             name="type"
             value={formik.values.type}
             onChange={formik.handleChange}
             onBlur={formik.handleBlur}
             disabled={!canEdit}
             className={formik.touched.type && formik.errors.type ? 'form-select invalid' : 'form-select'}
           >
             <option value={TIME_ENTRY_TYPES.CLOCK_IN}>Clock In</option>
             <option value={TIME_ENTRY_TYPES.CLOCK_OUT}>Clock Out</option>
           </select>
           {formik.touched.type && formik.errors.type && (
             <div className="error-text">{formik.errors.type}</div>
           )}
         </div>
         
         <div className="form-group">
           <label htmlFor="date">Date</label>
           <div className="date-input-wrapper">
             <AiOutlineCalendar className="date-icon" />
             <input
               id="date"
               type="date"
               value={formik.values.date}
               onChange={handleDateChange}
               disabled={!canEdit}
               className="date-input-native"
             />
           </div>
           {formik.touched.date && formik.errors.date && (
             <div className="error-text">{formik.errors.date}</div>
           )}
         </div>
         
         <div className="form-group">
           <label htmlFor="time">Time</label>
           <div className="time-input-wrapper">
             <AiOutlineClockCircle className="time-icon" />
             <input
               id="time"
               type="time"
               value={formik.values.time.substr(0, 5)}
               onChange={handleTimeChange}
               disabled={!canEdit}
               className="time-input-native"
             />
           </div>
           {formik.touched.time && formik.errors.time && (
             <div className="error-text">{formik.errors.time}</div>
           )}
         </div>
         
         <div className="form-group toggle-group">
           <label htmlFor="manual">Manual entry</label>
           <div className="toggle-container">
             <input
               type="checkbox"
               id="manual"
               name="manual"
               checked={formik.values.manual}
               onChange={formik.handleChange}
               disabled={!canEdit}
               className="toggle-input"
             />
             <label htmlFor="manual" className="toggle-label"></label>
           </div>
         </div>
         
         <div className="form-group">
           <label htmlFor="comments">Comments</label>
           <textarea
             id="comments"
             name="comments"
             value={formik.values.comments}
             onChange={formik.handleChange}
             onBlur={formik.handleBlur}
             rows={3}
             maxLength={200}
             disabled={!canEdit}
             className={formik.touched.comments && formik.errors.comments ? 'form-textarea invalid' : 'form-textarea'}
           />
           {formik.touched.comments && formik.errors.comments && (
             <div className="error-text">{formik.errors.comments}</div>
           )}
         </div>
         
         {error && (
           <div className="error-message">
             <p>{error}</p>
           </div>
         )}
         
         <div className="form-actions">
           {isAdmin && (
             <Button 
               variant="danger" 
               onClick={() => setShowDeleteAlert(true)}
               icon={<AiOutlineDelete />}
             >
               Delete
             </Button>
           )}
           
           <Button 
             variant="secondary" 
             onClick={() => {
               setEditMode(false);
               if (onCancel) onCancel();
             }}
             icon={<AiOutlineClose />}
           >
             Cancel
           </Button>
           
           {canEdit && (
             <Button 
               type="submit" 
               variant="primary" 
               disabled={loading}
               icon={loading ? <div className="spinner"></div> : <AiOutlineSave />}
             >
               Save
             </Button>
           )}
         </div>
       </form>
     ) : (
       <div className="time-entry-view">
         <div className="time-entry-header">
           <span className={`badge ${timeEntry.type === TIME_ENTRY_TYPES.CLOCK_IN ? 'badge-success' : 'badge-warning'}`}>
             {timeEntry.type === TIME_ENTRY_TYPES.CLOCK_IN ? 'Clock In' : 'Clock Out'}
           </span>
           
           {timeEntry.manual && (
             <span className="badge badge-medium">
               Manual
             </span>
           )}
         </div>
         
         <div className="time-entry-info">
           <div className="info-item">
             <div className="info-label">User</div>
             <div className="info-value">
               {timeEntry.user?.name || 'Unknown user'}
             </div>
           </div>
           
           <div className="info-item">
             <div className="info-label">Date</div>
             <div className="info-value">
               {formatDate(timeEntry.date)}
             </div>
           </div>
           
           <div className="info-item">
             <div className="info-label">Time</div>
             <div className="info-value">
               {formatTime(timeEntry.time)}
             </div>
           </div>
           
           {timeEntry.comments && (
             <div className="info-item">
               <div className="info-label">Comments</div>
               <div className="info-value">
                 {timeEntry.comments}
               </div>
             </div>
           )}
         </div>
         
         <div className="form-actions">
           {isAdmin && (
             <Button 
               variant="danger" 
               onClick={() => setShowDeleteAlert(true)}
               icon={<AiOutlineDelete />}
             >
               Delete
             </Button>
           )}
           
           <Button 
             variant="secondary" 
             onClick={onCancel}
             icon={<AiOutlineClose />}
           >
             Close
           </Button>
           
           {canEdit && (
             <Button 
               variant="primary" 
               onClick={toggleEditMode}
               icon={<AiOutlineEdit />}
             >
               Edit
             </Button>
           )}
         </div>
       </div>
     )}
     
     {showDeleteAlert && (
       <div className="modal-overlay">
         <div className="modal-container">
           <div className="modal-header">
             <h3>Confirm deletion</h3>
           </div>
           <div className="modal-content">
             <p>Are you sure you want to delete this clock record? This action cannot be undone.</p>
             <div className="button-group">
               <Button 
                 variant="secondary" 
                 onClick={() => setShowDeleteAlert(false)}
               >
                 Cancel
               </Button>
               <Button 
                 variant="danger" 
                 onClick={() => {
                   handleDelete();
                   setShowDeleteAlert(false);
                 }}
               >
                 Delete
               </Button>
             </div>
           </div>
         </div>
       </div>
     )}
   </div>
 );
};

export default TimeEntryDetail;