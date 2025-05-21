import React, { useState, useEffect } from 'react';
import {
 AiOutlineClockCircle,
 AiOutlineCalendar,
 AiOutlineLogout
} from 'react-icons/ai';
import { useNavigate } from 'react-router';
import moment from 'moment';
import Main from '../../components/main/Main';
import TimeEntryForm from '../../components/TimeEntryForm/TimeEntryForm';
import { getMyClockRecords } from '../../services/timeEntries';
import { useAuth } from '../../hooks/useAuth';
import { DATE_FORMAT } from '../../utils/constants';
import './DashboardPage.css';
import Button from '../../components/Button/Button';

const DashboardPage = () => {
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [lastClockRecord, setLastClockRecord] = useState(null);
 const [statistics, setStatistics] = useState({
   totalToday: 0,
   totalWeek: 0
 });

 const [clockRecordSuccess, setClockRecordSuccess] = useState(false);
 const [lastClockRecordType, setLastClockRecordType] = useState(null);
 
 const { user, logout } = useAuth(); 
 const navigate = useNavigate();
 
 useEffect(() => {
   setTimeout(() => {
     loadData();
   }, 600);
 }, []);
 
 const loadData = async () => { 
   setLoading(true);
   setError(null);
   
   try {
     const today = moment().format('YYYY-MM-DD');
     const response = await getMyClockRecords({ date: today });
     
     const clockRecords = response || [];
     if (clockRecords.length > 0) {
       const latest = clockRecords.reduce((prev, current) => {
         return moment(current.date + ' ' + current.time).isAfter(moment(prev.date + ' ' + prev.time))
           ? current : prev;
       });
       
       setLastClockRecord(latest);
       setLastClockRecordType(latest.type);
     } else {
       setLastClockRecord(null);
       setLastClockRecordType(null);
     }
     
     setStatistics({
       totalToday: clockRecords.length,
       totalWeek: 15 
     });
   } catch (err) {
     console.error('Error loading dashboard data:', err);
     setError('Error loading data. Please try again.');
   } finally {
     setLoading(false);
   }
 };
 
 const handleClockRecordSuccess = (type) => {
   setClockRecordSuccess(true);
   setLastClockRecordType(type);
    
   setTimeout(() => {
     setClockRecordSuccess(false);
   }, 3000);
    
   loadData();
 };
 
 const handleLogout = () => { 
   logout();
   navigate('/login');
 };

 return (
   <Main>
     <main className="content-container">
       <div className="dashboard-page">
         <div className="dashboard-header">
           <div className="welcome-section">
             <h1>Welcome{user?.name ? `, ${user.name}` : ''}!</h1>
             <p className="current-date">
               <AiOutlineCalendar className="icon-inline" />
               {moment().format(DATE_FORMAT.DATE)}
             </p>
           </div>
           <button onClick={handleLogout} className="logout-button">
             <AiOutlineLogout className="logout-icon" />
             Logout
           </button>
         </div>
         
         {error && (
           <div className="error-message">
             <p>{error}</p>
           </div>
         )}
         
         {clockRecordSuccess && (
           <div className="success-message">
             <p>
               {lastClockRecordType === 'clock_in' ? 'Clock-in' : 'Clock-out'} successfully recorded!
             </p>
           </div>
         )}
         
         <div className="grid-container">
           <div className="action-buttons-container">
             <button 
               className="action-button time-entries-button"
               onClick={() => navigate('/time-entries')}
             >
               <AiOutlineClockCircle className="button-icon" />
               View Clock Records
             </button>
           </div>
           
           <div className="grid-row">
             <div className="grid-col-12">
               <TimeEntryForm 
                 onSuccess={handleClockRecordSuccess} 
                 suggestedType={lastClockRecordType === 'clock_in' ? 'clock_out' : 'clock_in'} 
               />
             </div>
           </div>
         </div>
       </div>
     </main>
   </Main>
 );
};

export default DashboardPage;