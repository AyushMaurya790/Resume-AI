import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/auth';
import { DataGrid } from '@mui/x-data-grid';
import '../styles/admin.css';

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedTab, setSelectedTab] = useState('users');

  useEffect(() => {
    if (!isAdmin) return;
    
    const fetchAdminData = async () => {
      try {
        const responses = await Promise.all([
          fetch('/api/admin/users'),
          fetch('/api/admin/resumes'),
          fetch('/api/admin/payments')
        ]);
        
        const [usersData, resumesData, paymentsData] = await Promise.all(
          responses.map(res => res.json())
        );
        
        setUsers(usersData);
        setResumes(resumesData);
        setPayments(paymentsData);
      } catch (error) {
        console.error('Admin data fetch error:', error);
      }
    };
    
    fetchAdminData();
  }, [isAdmin]);

  if (!isAdmin) {
    return <div className="unauthorized">Unauthorized Access</div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <div className="admin-tabs">
          <button 
            className={selectedTab === 'users' ? 'active btn-red' : 'btn-red'}
            onClick={() => setSelectedTab('users')}
          >
            Users
          </button>
          <button 
            className={selectedTab === 'resumes' ? 'active btn-blue' : 'btn-blue'}
            onClick={() => setSelectedTab('resumes')}
          >
            Resumes
          </button>
          <button 
            className={selectedTab === 'payments' ? 'active btn-red' : 'btn-red'}
            onClick={() => setSelectedTab('payments')}
          >
            Payments
          </button>
        </div>
      </div>

      <div className="admin-content">
        {selectedTab === 'users' && (
          <div className="data-grid-container">
            <DataGrid
              rows={users}
              columns={[
                { field: 'id', headerName: 'ID', width: 70 },
                { field: 'email', headerName: 'Email', width: 200 },
                { field: 'createdAt', headerName: 'Joined', width: 150 },
                { field: 'premium', headerName: 'Premium', width: 100 },
                { field: 'actions', headerName: 'Actions', width: 150 }
              ]}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
            />
          </div>
        )}
        
        {/* Similar grids for resumes and payments */}
      </div>
    </div>
  );
};

export default Admin;