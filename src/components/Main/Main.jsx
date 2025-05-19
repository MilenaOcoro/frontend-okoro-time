import React from 'react'; 
import { useAuth } from '../../hooks/useAuth';
import './Main.css';

const Main = ({ children }) => { 
  const { isAuthenticated } = useAuth();
    
  return (
    <div className="main-container">
      {isAuthenticated ? (
        <main className="main-content">
          {children}
        </main>
      ) : (
        <div className="main-container">
          {children}
        </div>
      )}
    </div>
  );
};

export default Main;