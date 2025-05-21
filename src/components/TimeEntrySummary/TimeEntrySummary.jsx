import React, { useState, useEffect } from 'react';
import { AiOutlineCalendar } from 'react-icons/ai';
import moment from 'moment';
import './TimeEntrySummary.css';
import { useAuth } from '../../hooks/useAuth';
import { getAllUsers, getSummaryRecord } from '../../services/timeEntries';
import Card from '../Card/Card';

const TimeEntrySummary = () => {
 const [period, setPeriod] = useState('dia');
 const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
 const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
 const [userId, setUserId] = useState('');
 const [users, setUsers] = useState([]); 
 const [summary, setSummary] = useState(null);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState('');
 
 const { hasRole } = useAuth();
 const isAdmin = hasRole('ADMIN');
 
 useEffect(() => {
   if (isAdmin) {
     loadUsers();
   }
 }, [isAdmin]);
  
 useEffect(() => {
   loadSummary();
 }, [period, startDate, endDate, userId]);
  
 const loadUsers = async () => {
   try {
     const response = await getAllUsers();
     setUsers(response || []);
   } catch (err) {
     console.error('Error loading users:', err);
     setError('Error loading user list');
   }
 };
  
 const loadSummary = async () => {
   setLoading(true);
   setError('');
   
   try {
     const response = await getSummaryRecord(
       period,
       startDate,
       endDate,
       userId || null
     );
     
     setSummary(response || {});
   } catch (err) {
     console.error('Error loading summary:', err);
     setError('Error loading clock records summary');
   } finally {
     setLoading(false);
   }
 };
  
 const handlePeriodChange = (e) => {
   const newPeriod = e.target.value;
   setPeriod(newPeriod);
    
   const today = moment();
   
   switch (newPeriod) {
     case 'dia':
       setStartDate(today.format('YYYY-MM-DD'));
       setEndDate(today.format('YYYY-MM-DD'));
       break;
     case 'semana':
       setStartDate(today.startOf('week').format('YYYY-MM-DD'));
       setEndDate(today.endOf('week').format('YYYY-MM-DD'));
       break;
     case 'mes':
       setStartDate(today.startOf('month').format('YYYY-MM-DD'));
       setEndDate(today.endOf('month').format('YYYY-MM-DD'));
       break;
     default:
       break;
   }
 };
 
 const handleStartDateChange = (e) => {
   const formattedDate = moment(e.target.value).format('YYYY-MM-DD');
   setStartDate(formattedDate);
 };
 
 const handleEndDateChange = (e) => {
   const formattedDate = moment(e.target.value).format('YYYY-MM-DD');
   setEndDate(formattedDate);
 };
 
 const formatHours = (minutes) => {
   if (!minutes && minutes !== 0) return '--:--';
   
   const hours = Math.floor(minutes / 60);
   const mins = minutes % 60;
   
   return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
 };
 
 return (
   <div className="time-entry-summary">
     <Card title="Clock Records Summary">
       <div className="segment-container">
         <div className="segment" role="radiogroup">
           <button 
             className={`segment-button ${period === 'dia' ? 'segment-button-checked' : ''}`}
             value="dia"
             onClick={handlePeriodChange}
           >
             Day
           </button>
           <button 
             className={`segment-button ${period === 'semana' ? 'segment-button-checked' : ''}`}
             value="semana"
             onClick={handlePeriodChange}
           >
             Week
           </button>
           <button 
             className={`segment-button ${period === 'mes' ? 'segment-button-checked' : ''}`}
             value="mes"
             onClick={handlePeriodChange}
           >
             Month
           </button>
         </div>
       </div>
       
       <div className="date-filters">
         <div className="date-filter">
           <div className="date-input-container">
             <label htmlFor="fecha-inicio">From:</label>
             <div className="date-input-wrapper">
               <AiOutlineCalendar className="date-icon" />
               <input 
                 id="fecha-inicio"
                 type="date" 
                 value={startDate} 
                 onChange={handleStartDateChange}
                 className="date-input-native"
               />
             </div>
           </div>
         </div>
         
         <div className="date-filter">
           <div className="date-input-container">
             <label htmlFor="fecha-fin">To:</label>
             <div className="date-input-wrapper">
               <AiOutlineCalendar className="date-icon" />
               <input 
                 id="fecha-fin"
                 type="date" 
                 value={endDate} 
                 onChange={handleEndDateChange}
                 className="date-input-native"
               />
             </div>
           </div>
         </div>
       </div>
       
       {isAdmin && (
         <div className="select-container">
           <label htmlFor="user-select">User</label>
           <select 
             id="user-select"
             value={userId} 
             onChange={(e) => setUserId(e.target.value)}
             className="form-select"
           >
             <option value="">All</option>
             {users.map(user => (
               <option key={user.id} value={user.id}>
                 {user.name}
               </option>
             ))}
           </select>
         </div>
       )}
       
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
           {summary && (
             <div className="summary-table-container">
               <table className="summary-table">
                 <thead>
                   <tr>
                     <th>User</th>
                     <th>Days Worked</th>
                     <th>Total Hours</th>
                     <th>Daily Average</th>
                   </tr>
                 </thead>
                 <tbody>
                   {summary.users && summary.users.length > 0 ? (
                     summary.users.map((item, index) => (
                       <tr key={index}>
                         <td>{item.name}</td>
                         <td>{item.daysWorked}</td>
                         <td>{formatHours(item.totalMinutes)}</td>
                         <td>{formatHours(item.averageMinutesDaily)}</td>
                       </tr>
                     ))
                   ) : (
                     <tr>
                       <td colSpan="4" className="no-data">
                         No data for the selected period
                       </td>
                     </tr>
                   )}
                 </tbody>
                 {summary.totals && summary.users && summary.users.length > 0 && (
                   <tfoot>
                     <tr className="total-row">
                       <td>TOTAL</td>
                       <td>{summary.totals.daysWorked}</td>
                       <td>{formatHours(summary.totals.totalMinutes)}</td>
                       <td>{formatHours(summary.totals.averageMinutesDaily)}</td>
                     </tr>
                   </tfoot>
                 )}
               </table>
             </div>
           )}
         </>
       )}
     </Card>
   </div>
 );
};

export default TimeEntrySummary;