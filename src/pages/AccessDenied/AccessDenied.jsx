import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineWarning, AiOutlineHome } from 'react-icons/ai';
import './AccessDenied.css';
import Button from '../../components/Button/Button';

const AccessDenied = () => {
  const navigate = useNavigate();

  const handleReturn = () => {
    navigate('/dashboard');
  };

  return (
    <div className="access-denied">
      <div className="access-denied-card">
        <div className="icon-container">
          <AiOutlineWarning className="warning-icon" />
        </div>
        
        <h1 className="title">Access Denied</h1>
        
        <p className="message">
          You do not have the necessary permissions to access this section.
        </p>
        
        <Button 
          className="return-button"
          onClick={handleReturn}
        >
          <AiOutlineHome className="button-icon" />
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default AccessDenied;