import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import Main from '../../components/main/Main';
import TimeEntryList from '../../components/TimeEntryList/TimeEntryList'; 
import TimeEntryDetail from '../../components/TimeEntryDetail/TimeEntryDetail';
import { useAuth } from '../../hooks/useAuth';
import './TimeEntriesPage.css'; 

const TimeEntriesPage = () => { 
 const [showDetailModal, setShowDetailModal] = useState(false);
 const [selectedTimeEntry, setSelectedTimeEntry] = useState(null);
 const [showToast, setShowToast] = useState(false);
 const [toastMessage, setToastMessage] = useState('');
 const [toastColor, setToastColor] = useState('success');
 const [shouldRefresh, setShouldRefresh] = useState(false);
 
 const { hasRole } = useAuth();
 const isAdmin = hasRole('ADMIN'); 
 
 const handleEditTimeEntry = (timeEntry) => {
   setSelectedTimeEntry(timeEntry);
   setShowDetailModal(true);
 };
 
 const handleTimeEntryEdited = () => {
   setShowDetailModal(false);
   setShouldRefresh(true);
   showToastMessage('Clock record updated successfully', 'success');
 };
 
 const handleTimeEntryDeleted = () => {
   showToastMessage('Clock record deleted successfully', 'success');
 };
 
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
       <div className="time-entries-page">
         <div className="page-header">
           <h1>Clock Records</h1>
         </div>
         
         <div className="grid-container">
           <div className="grid-row">
             <div className="grid-col">
               <TimeEntryList 
                 isAdmin={isAdmin} 
                 onEdit={handleEditTimeEntry} 
                 onDeleted={handleTimeEntryDeleted}
                 refreshTrigger={shouldRefresh}
                 onRefreshComplete={() => setShouldRefresh(false)}
               />
             </div>
           </div>
         </div>
        
         {showDetailModal && (
           <div className="modal-overlay">
             <div className="modal-container">
               <div className="modal-header">
                 <h2>Clock Record Details</h2>
                 <button className="btn btn-link" onClick={() => setShowDetailModal(false)}>
                   <AiOutlineClose className="button-icon" />
                 </button>
               </div>
               <div className="modal-content">
                 {selectedTimeEntry && (
                   <TimeEntryDetail
                     timeEntry={selectedTimeEntry} 
                     onSave={handleTimeEntryEdited} 
                     onCancel={() => setShowDetailModal(false)} 
                     onDelete={handleTimeEntryDeleted}
                     isAdmin={isAdmin}
                   />
                 )}
               </div>
             </div>
           </div>
         )}
         
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

export default TimeEntriesPage;