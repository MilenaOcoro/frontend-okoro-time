import React, { useState, useEffect } from 'react';
import { 
 AiOutlineEdit, 
 AiOutlineDelete, 
 AiOutlineCalendar, 
 AiOutlineClockCircle
} from 'react-icons/ai';
import moment from 'moment';
import { getMyClockRecords, getAllClockRecords, deleteClockRecord } from '../../services/timeEntries';
import { useAuth } from '../../hooks/useAuth';
import './TimeEntryList.css';
import Card from '../Card/Card';
import Button from '../Button/Button';

const TimeEntryList = ({ isAdmin, onEdit, onDeleted, refreshTrigger, onRefreshComplete }) => {
 const [clockRecords, setClockRecords] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState('');
 const [filterDate, setFilterDate] = useState(moment().format('YYYY-MM-DD'));
 const [searchText, setSearchText] = useState('');
 const [showDeleteAlert, setShowDeleteAlert] = useState(false);
 const [clockRecordToDelete, setClockRecordToDelete] = useState(null);
 
 const { user } = useAuth();
 
 useEffect(() => {
   loadClockRecords();
 }, [filterDate, isAdmin]);

 useEffect(() => {
   if (refreshTrigger) {
     loadClockRecords().then(() => {
       if (onRefreshComplete) onRefreshComplete();
     });
   }
 }, [refreshTrigger]);
 
 const loadClockRecords = async () => {
   setLoading(true);
   setError('');
   
   try {
     const params = {
       date: filterDate
     };
     
     const response = isAdmin 
       ? await getAllClockRecords(params) 
       : await getMyClockRecords(params);
     
     setClockRecords(response || []);
   } catch (err) {
     console.error('Error loading clock records:', err);
     setError('Error loading clock records. Please try again.');
   } finally {
     setLoading(false);
   }
 };
 
 const handleDateChange = (e) => {
   const formattedDate = moment(e.target.value).format('YYYY-MM-DD');
   setFilterDate(formattedDate);
 };
 
 const filteredClockRecords = clockRecords.filter(entry => { 
   if (!searchText) return true;
   
   const searchLower = searchText.toLowerCase();
   return (
     (entry.user?.name?.toLowerCase().includes(searchLower)) ||
     (entry.comments?.toLowerCase().includes(searchLower)) ||
     (entry.type?.toLowerCase().includes(searchLower))
   );
 });
 
 const handleEdit = (entry) => { 
   if (onEdit) {
     onEdit(entry);
   }
 };
 
 const confirmDelete = (entry) => {
   setClockRecordToDelete(entry);
   setShowDeleteAlert(true);
 };
 
 const handleDelete = async () => {
   if (!clockRecordToDelete) return;
   
   try {
     await deleteClockRecord(clockRecordToDelete.id);
     
     loadClockRecords();
     
     if (onDeleted) {
       onDeleted(clockRecordToDelete);
     }
     setShowDeleteAlert(false);
   } catch (err) {
     console.error('Error deleting clock record:', err);
     setError('Error deleting the clock record');
   }
 };
 
 const formatTime = (time) => {
   return time ? moment(time, 'HH:mm:ss').format('HH:mm') : '--:--';
 };
 
 return (
   <div className="time-entry-list">
     <Card title={isAdmin ? 'All Clock Records' : 'My Clock Records'}>
       <div className="filters-container">
         <div className="date-filter">
           <AiOutlineCalendar className="icon" />
           <input
             type="date"
             value={filterDate}
             onChange={handleDateChange}
             className="date-input-inline"
           />
         </div>
         
         {isAdmin && (
           <div className="search-container">
             <input
               type="text"
               value={searchText}
               onChange={(e) => setSearchText(e.target.value)}
               placeholder="Search by name or comment"
               className="form-input"
             />
           </div>
         )}
       </div>
       
       {error && (
         <div className="error-message">
           <p>{error}</p>
         </div>
       )}
       
       {loading ? (
         <div className="loading-container">
           <div className="spinner"></div>
         </div>
       ) : (
         <>
           {filteredClockRecords.length > 0 ? (
             <ul className="time-entries-list">
               {filteredClockRecords.map((entry) => (
                 <li key={entry.id} className="time-entry-item">
                   <div className="time-entry-content">
                     <div className="time-entry-header">
                       {isAdmin && entry.user?.name && (
                         <span className="time-entry-user">{entry.user.name} - </span>
                       )}
                       <span className={`badge ${entry.type === 'clock_in' ? 'badge-success' : 'badge-warning'}`}>
                         {entry.type === 'clock_in' ? 'Clock In' : 'Clock Out'}
                       </span>
                       {entry.manual && (
                         <span className="badge badge-medium">
                           Manual
                         </span>
                       )}
                     </div>
                     <p className="time-entry-details">
                       <AiOutlineCalendar className="detail-icon" />
                       {moment(entry.date).format('DD/MM/YYYY')}
                       <AiOutlineClockCircle className="detail-icon detail-icon-margin" />
                       {formatTime(entry.time)}
                     </p>
                     {entry.comments && (
                       <p className="time-entry-comments">{entry.comments}</p>
                     )}
                   </div>
                   
                   <div className="time-entry-actions">
                     {(isAdmin || entry.user_id === user.id) && (
                       <button className="action-button" onClick={() => handleEdit(entry)}>
                         <AiOutlineEdit />
                       </button>
                     )}
                     
                     {isAdmin && (
                       <button className="action-button action-button-danger" onClick={() => confirmDelete(entry)}>
                         <AiOutlineDelete />
                       </button>
                     )}
                   </div>
                 </li>
               ))}
             </ul>
           ) : (
             <div className="empty-message">
               <p>No clock records for the selected date.</p>
             </div>
           )}
         </>
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
                   onClick={handleDelete}
                 >
                   Delete
                 </Button>
               </div>
             </div>
           </div>
         </div>
       )}
     </Card>
   </div>
 );
};

export default TimeEntryList;