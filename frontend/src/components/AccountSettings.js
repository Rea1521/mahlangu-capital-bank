import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccount, updateAccountStatus, updateCustomer } from '../services/api';
import { toast } from 'react-toastify';

function AccountSettings({ accountNumber, onClose }) {
  const [account, setAccount] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [activeTab, setActiveTab] = useState('account');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadAccountDetails();
    const customerData = localStorage.getItem('customer');
    if (customerData) {
      const customer = JSON.parse(customerData);
      setCustomer(customer);
      setFormData({
        fullName: customer.fullName || '',
        phoneNumber: customer.phoneNumber || '',
        address: customer.address || '',
        email: customer.email || ''
      });
    }
  }, [accountNumber]);

  const loadAccountDetails = async () => {
    try {
      const response = await getAccount(accountNumber);
      setAccount(response.data);
    } catch (error) {
      toast.error('Failed to load account details');
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateAccountStatus(accountNumber, newStatus);
      toast.success(`Account ${newStatus.toLowerCase()} successfully`);
      loadAccountDetails();
      setShowConfirmDialog(false);
    } catch (error) {
      toast.error(`Failed to ${newStatus.toLowerCase()} account`);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await updateCustomer(customer.id, formData);
      localStorage.setItem('customer', JSON.stringify({ ...customer, ...formData }));
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleChangePin = () => {
    // Navigate to change PIN page or show modal
    toast.info('PIN change feature coming soon');
  };

  const handleCloseAccount = () => {
    setConfirmAction({
      type: 'close',
      message: 'Are you sure you want to close this account? This action cannot be undone.',
      action: () => handleStatusChange('CLOSED')
    });
    setShowConfirmDialog(true);
  };

  const handleSuspendAccount = () => {
    setConfirmAction({
      type: 'suspend',
      message: 'Are you sure you want to suspend this account? No transactions will be possible while suspended.',
      action: () => handleStatusChange('SUSPENDED')
    });
    setShowConfirmDialog(true);
  };

  const handleActivateAccount = () => {
    setConfirmAction({
      type: 'activate',
      message: 'Are you sure you want to activate this account?',
      action: () => handleStatusChange('ACTIVE')
    });
    setShowConfirmDialog(true);
  };

  if (!account) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#FFFFFF' }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#000000',
      minHeight: '100vh',
      color: '#FFFFFF',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#FFD700',
            fontSize: '24px',
            marginRight: '15px',
            cursor: 'pointer'
          }}
        >
          ←
        </button>
        <h2 style={{ color: '#FFD700', fontSize: '20px' }}>Account Settings</h2>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #333',
        marginBottom: '20px'
      }}>
        <button
          onClick={() => setActiveTab('account')}
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            padding: '10px',
            color: activeTab === 'account' ? '#FFD700' : '#FFFFFF',
            borderBottom: activeTab === 'account' ? '2px solid #FFD700' : 'none',
            cursor: 'pointer'
          }}
        >
          Account
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            padding: '10px',
            color: activeTab === 'profile' ? '#FFD700' : '#FFFFFF',
            borderBottom: activeTab === 'profile' ? '2px solid #FFD700' : 'none',
            cursor: 'pointer'
          }}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab('security')}
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            padding: '10px',
            color: activeTab === 'security' ? '#FFD700' : '#FFFFFF',
            borderBottom: activeTab === 'security' ? '2px solid #FFD700' : 'none',
            cursor: 'pointer'
          }}
        >
          Security
        </button>
      </div>

      {/* Account Settings Tab */}
      {activeTab === 'account' && (
        <div>
          {/* Account Info */}
          <div style={{
            backgroundColor: '#1A1A1A',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: '#FFD700', marginBottom: '15px' }}>Account Information</h3>
            <div style={{ marginBottom: '10px' }}>
              <div style={{ color: '#FFD700', fontSize: '12px' }}>Account Number</div>
              <div style={{ fontSize: '16px' }}>{account.accountNumber}</div>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <div style={{ color: '#FFD700', fontSize: '12px' }}>Account Type</div>
              <div style={{ fontSize: '16px' }}>{account.accountType}</div>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <div style={{ color: '#FFD700', fontSize: '12px' }}>Current Status</div>
              <div style={{
                color: account.status === 'ACTIVE' ? '#00FF00' : 
                       account.status === 'SUSPENDED' ? '#FFD700' : '#FF0000'
              }}>
                {account.status}
              </div>
            </div>
            <div>
              <div style={{ color: '#FFD700', fontSize: '12px' }}>Opened Date</div>
              <div style={{ fontSize: '16px' }}>
                {new Date(account.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div style={{
            backgroundColor: '#1A1A1A',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <h3 style={{ color: '#FFD700', marginBottom: '15px' }}>Account Actions</h3>
            
            {account.status === 'ACTIVE' && (
              <>
                <button
                  onClick={handleSuspendAccount}
                  style={{
                    width: '100%',
                    backgroundColor: 'transparent',
                    border: '1px solid #FFD700',
                    color: '#FFD700',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '10px',
                    cursor: 'pointer'
                  }}
                >
                  Suspend Account
                </button>
                <button
                  onClick={handleCloseAccount}
                  style={{
                    width: '100%',
                    backgroundColor: '#FF0000',
                    border: 'none',
                    color: '#FFFFFF',
                    padding: '12px',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Close Account
                </button>
              </>
            )}

            {account.status === 'SUSPENDED' && (
              <button
                onClick={handleActivateAccount}
                style={{
                  width: '100%',
                  backgroundColor: '#00FF00',
                  border: 'none',
                  color: '#000000',
                  padding: '12px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Activate Account
              </button>
            )}

            {account.status === 'CLOSED' && (
              <p style={{ color: '#FFD700', textAlign: 'center' }}>
                This account is closed and cannot be reactivated
              </p>
            )}
          </div>
        </div>
      )}

      {/* Profile Settings Tab */}
      {activeTab === 'profile' && (
        <div style={{
          backgroundColor: '#1A1A1A',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ color: '#FFD700' }}>Profile Information</h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #FFD700',
                  color: '#FFD700',
                  padding: '5px 15px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Edit
              </button>
            )}
          </div>

          {isEditing ? (
            <div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#FFD700', fontSize: '12px', display: 'block', marginBottom: '5px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  style={{
                    width: '100%',
                    backgroundColor: '#000000',
                    border: '1px solid #FFD700',
                    color: '#FFFFFF',
                    padding: '10px',
                    borderRadius: '5px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#FFD700', fontSize: '12px', display: 'block', marginBottom: '5px' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  style={{
                    width: '100%',
                    backgroundColor: '#000000',
                    border: '1px solid #FFD700',
                    color: '#FFFFFF',
                    padding: '10px',
                    borderRadius: '5px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#FFD700', fontSize: '12px', display: 'block', marginBottom: '5px' }}>
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows="3"
                  style={{
                    width: '100%',
                    backgroundColor: '#000000',
                    border: '1px solid #FFD700',
                    color: '#FFFFFF',
                    padding: '10px',
                    borderRadius: '5px'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleUpdateProfile}
                  style={{
                    flex: 1,
                    backgroundColor: '#FFD700',
                    border: 'none',
                    color: '#000000',
                    padding: '10px',
                    borderRadius: '5px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      fullName: customer.fullName || '',
                      phoneNumber: customer.phoneNumber || '',
                      address: customer.address || '',
                      email: customer.email || ''
                    });
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    border: '1px solid #FFD700',
                    color: '#FFD700',
                    padding: '10px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: '15px' }}>
                <div style={{ color: '#FFD700', fontSize: '12px' }}>Full Name</div>
                <div>{customer?.fullName}</div>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <div style={{ color: '#FFD700', fontSize: '12px' }}>Email</div>
                <div>{customer?.email}</div>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <div style={{ color: '#FFD700', fontSize: '12px' }}>Phone Number</div>
                <div>{customer?.phoneNumber || 'Not provided'}</div>
              </div>
              <div>
                <div style={{ color: '#FFD700', fontSize: '12px' }}>Address</div>
                <div>{customer?.address || 'Not provided'}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Security Settings Tab */}
      {activeTab === 'security' && (
        <div>
          <div style={{
            backgroundColor: '#1A1A1A',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: '#FFD700', marginBottom: '15px' }}>PIN Management</h3>
            <button
              onClick={handleChangePin}
              style={{
                width: '100%',
                backgroundColor: '#FFD700',
                border: 'none',
                color: '#000000',
                padding: '12px',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Change PIN
            </button>
            <p style={{ color: '#FFD700', fontSize: '12px', marginTop: '10px', textAlign: 'center' }}>
              PIN is required for withdrawals and transfers
            </p>
          </div>

          <div style={{
            backgroundColor: '#1A1A1A',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <h3 style={{ color: '#FFD700', marginBottom: '15px' }}>Security Settings</h3>
            
            {/* Two Factor Authentication */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '15px 0',
              borderBottom: '1px solid #333'
            }}>
              <div>
                <div style={{ fontWeight: '600' }}>Two-Factor Authentication</div>
                <div style={{ fontSize: '12px', color: '#FFD700', opacity: 0.7 }}>
                  Add extra security to your account
                </div>
              </div>
              <div className={`toggle-switch ${false ? 'active' : ''}`}>
                <div className="toggle-slider"></div>
              </div>
            </div>

            {/* Login Alerts */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '15px 0',
              borderBottom: '1px solid #333'
            }}>
              <div>
                <div style={{ fontWeight: '600' }}>Login Alerts</div>
                <div style={{ fontSize: '12px', color: '#FFD700', opacity: 0.7 }}>
                  Get notified of new logins
                </div>
              </div>
              <div className={`toggle-switch ${true ? 'active' : ''}`}>
                <div className="toggle-slider"></div>
              </div>
            </div>

            {/* Transaction Alerts */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '15px 0'
            }}>
              <div>
                <div style={{ fontWeight: '600' }}>Transaction Alerts</div>
                <div style={{ fontSize: '12px', color: '#FFD700', opacity: 0.7 }}>
                  SMS/Email for all transactions
                </div>
              </div>
              <div className={`toggle-switch ${true ? 'active' : ''}`}>
                <div className="toggle-slider"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.9)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#1A1A1A',
            padding: '30px',
            borderRadius: '12px',
            maxWidth: '400px',
            margin: '20px',
            border: '1px solid #FFD700'
          }}>
            <h3 style={{ color: '#FFD700', marginBottom: '15px' }}>Confirm Action</h3>
            <p style={{ color: '#FFFFFF', marginBottom: '20px' }}>
              {confirmAction?.message}
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  confirmAction.action();
                }}
                style={{
                  flex: 1,
                  backgroundColor: '#FFD700',
                  border: 'none',
                  color: '#000000',
                  padding: '10px',
                  borderRadius: '5px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Confirm
              </button>
              <button
                onClick={() => setShowConfirmDialog(false)}
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  border: '1px solid #FFD700',
                  color: '#FFD700',
                  padding: '10px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountSettings;