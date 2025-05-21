import React, { useState, useEffect } from 'react';
import { 
  AiOutlineEdit, 
  AiOutlineDelete, 
  AiOutlineClose, 
  AiOutlineUser
} from 'react-icons/ai';
import { Navigate, useNavigate } from 'react-router-dom';
import Main from '../../components/main/Main';
import UserForm from '../../components/UserForm/UserForm';
import { getAllUsers, deleteUser } from '../../services/users';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';
import './UsersPage.css';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState('success');
  
  const { hasRole } = useAuth();
  const isAdmin = hasRole('ADMIN');
  const navigate = useNavigate();
   
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
   
  useEffect(() => {
    loadUsers();
  }, []);
  
  
  const loadUsers = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await getAllUsers();
      setUsers(response || []);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Error loading user list');
    } finally {
      setLoading(false);
    }
  };
  
  
  const filteredUsers = users.filter(user => {
    if (!searchText) return true;
    
    const searchLower = searchText.toLowerCase();
    return (
      user.nombre?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.role?.toLowerCase().includes(searchLower)
    );
  });
  
  
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };
  
  
  const handleConfirmDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteAlert(true);
  };
  
  
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      await deleteUser(selectedUser.id);
      
      
      await loadUsers();
      
      
      showToastMessage('User successfully deleted', 'success');
    } catch (err) {
      console.error('Error deleting user:', err);
      showToastMessage('Error deleting user', 'danger');
    }
  };
  
  
  const handleUserSaved = async () => {
    setShowModal(false);
    
    
    await loadUsers();
    
    
    showToastMessage('User successfully updated', 'success');
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
        <div className="users-page">
          <div className="page-header">
            <h1>User Management</h1> 
          </div>
          
          <div className="grid-container">
            <div className="grid-row">
              <div className="grid-col">
                <Card title="Users">
                  {/* Search */}
                  <div className="search-container">
                    <input
                      type="text"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      placeholder="Search by name, email or role"
                      className="search-input"
                    />
                  </div>
                  
                  {/* Error message */}
                  {error && (
                    <div className="error-message">
                      <p>{error}</p>
                    </div>
                  )}
                  
                  {/* Loading indicator */}
                  {loading ? (
                    <div className="loading-container">
                      <div className="spinner"></div>
                    </div>
                  ) : (
                    <>
                      {/* User list */}
                      {filteredUsers.length > 0 ? (
                        <ul className="users-list">
                          {filteredUsers.map((user) => (
                            <li key={user.id} className="user-item">
                              <div className="user-icon">
                                <AiOutlineUser />
                              </div>
                              <div className="user-content">
                                <h3 className="user-name">{user.nombre}</h3>
                                <p className="user-email">{user.email}</p>
                              </div>
                              <span className={`badge ${user.rol === ROLES.ADMIN ? 'badge-admin' : 'badge-user'}`}>
                                {user.role === ROLES.ADMIN ? 'ADMIN' : 'User'}
                              </span>
                              <div className="user-actions">
                                <button className="action-button" onClick={() => handleEditUser(user)}>
                                  <AiOutlineEdit />
                                </button>
                                <button className="action-button action-button-danger" onClick={() => handleConfirmDelete(user)}>
                                  <AiOutlineDelete />
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="empty-message">
                          <p>
                            {searchText ? 'No users found with that search.' : 'No registered users.'}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </div>
        
        {/* Modal to edit user */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header">
                <h2>Edit User</h2>
                <button className="close-button" onClick={() => setShowModal(false)}>
                  <AiOutlineClose />
                </button>
              </div>
              <div className="modal-content">
                <UserForm 
                  user={selectedUser} 
                  mode="edit" 
                  onSave={handleUserSaved} 
                  onCancel={() => setShowModal(false)} 
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Delete confirmation alert */}
        {showDeleteAlert && (
          <div className="alert-overlay">
            <div className="alert-container">
              <div className="alert-header">
                <h3>Confirm deletion</h3>
              </div>
              <div className="alert-content">
                <p>
                  {selectedUser 
                    ? `Are you sure you want to delete user ${selectedUser.nombre}? This action cannot be undone.` 
                    : "Are you sure you want to delete this user? This action cannot be undone."}
                </p>
                <div className="button-group">
                  <Button 
                    onClick={() => setShowDeleteAlert(false)}
                    variant="secondary"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => {
                      handleDeleteUser();
                      setShowDeleteAlert(false);
                    }}
                    variant="danger"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Toast for messages */}
        {showToast && (
          <div className={`toast-container toast-${toastColor}`}>
            <p>{toastMessage}</p>
          </div>
        )}
      </main>
    </Main>
  );
};

export default UsersPage;