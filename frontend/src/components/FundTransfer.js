import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Modal } from 'react-bootstrap';
import { transferFunds, getAccount, getCustomerAccounts } from '../services/api';
import { toast } from 'react-toastify';

function FundTransfer({ fromAccount, onSuccess, allAccounts = [] }) {
  const [selectedFromAccount, setSelectedFromAccount] = useState(fromAccount);
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [transferDetails, setTransferDetails] = useState(null);
  const [recipientInfo, setRecipientInfo] = useState(null);
  const [senderInfo, setSenderInfo] = useState(null);
  const [validationError, setValidationError] = useState('');

  // Filter accounts for destination (exclude selected from account)
  const availableToAccounts = allAccounts.filter(acc => acc.accountNumber !== selectedFromAccount);

  // Validate account when toAccount changes
  useEffect(() => {
    const validateToAccount = async () => {
      if (toAccount.length >= 10) { // Basic validation for account number length
        setValidating(true);
        setValidationError('');
        try {
          const response = await getAccount(toAccount);
          setRecipientInfo({
            accountNumber: response.data.accountNumber,
            accountHolder: response.data.customer?.fullName || 'Unknown',
            accountType: response.data.accountType,
            active: response.data.status === 'ACTIVE'
          });
        } catch (error) {
          setRecipientInfo(null);
          setValidationError('Account not found');
        } finally {
          setValidating(false);
        }
      } else {
        setRecipientInfo(null);
      }
    };

    const timeoutId = setTimeout(validateToAccount, 500);
    return () => clearTimeout(timeoutId);
  }, [toAccount]);

  // Validate sender account when selectedFromAccount changes
  useEffect(() => {
    const validateFromAccount = async () => {
      if (selectedFromAccount) {
        try {
          const response = await getAccount(selectedFromAccount);
          setSenderInfo({
            accountNumber: response.data.accountNumber,
            accountHolder: response.data.customer?.fullName || 'Unknown',
            balance: response.data.balance,
            active: response.data.status === 'ACTIVE'
          });
        } catch (error) {
          setSenderInfo(null);
        }
      }
    };
    validateFromAccount();
  }, [selectedFromAccount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationError('');

    // Validate amount
    if (parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    // Check if recipient account is valid
    if (!recipientInfo) {
      setError('Please enter a valid recipient account number');
      return;
    }

    // Check if recipient account is active
    if (recipientInfo && !recipientInfo.active) {
      setError('Recipient account is not active');
      return;
    }

    // Check sufficient funds
    if (senderInfo && parseFloat(amount) > senderInfo.balance) {
      setError('Insufficient funds');
      return;
    }

    // Show confirmation modal
    setTransferDetails({
      fromAccount: selectedFromAccount,
      fromAccountHolder: senderInfo?.accountHolder,
      toAccount,
      toAccountHolder: recipientInfo?.accountHolder,
      amount: parseFloat(amount),
      description: description || 'Transfer',
      internalTransfer: allAccounts.some(acc => acc.accountNumber === toAccount)
    });
    setShowConfirmation(true);
  };

  const confirmTransfer = async () => {
    setLoading(true);
    setShowConfirmation(false);

    try {
      const response = await transferFunds({
        fromAccount: selectedFromAccount,
        toAccount,
        amount,
        pin,
        description
      });

      if (response.data.success) {
        toast.success(
          <div>
            <strong>Transfer Successful!</strong><br />
            R{amount} sent to {recipientInfo?.accountHolder}<br />
            New balance: R{response.data.fromAccountBalance?.toFixed(2)}
          </div>,
          { autoClose: 5000 }
        );
        
        // Clear form
        setToAccount('');
        setAmount('');
        setPin('');
        setDescription('');
        setRecipientInfo(null);
        onSuccess();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to process transfer';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        {error && <Alert variant="danger">{error}</Alert>}
        
        {/* From Account Selection */}
        <Form.Group className="mb-3">
          <Form.Label>From Account (Your Card)</Form.Label>
          <Form.Select
            value={selectedFromAccount}
            onChange={(e) => setSelectedFromAccount(e.target.value)}
            required
            style={{
              backgroundColor: '#F5F5F5',
              border: '1px solid #FFD700',
              padding: '10px',
              borderRadius: '8px'
            }}
          >
            {allAccounts.length > 0 ? (
              allAccounts.map(acc => (
                <option key={acc.id} value={acc.accountNumber}>
                  {acc.accountNumber} - {acc.accountType} (R{acc.balance?.toFixed(2)})
                </option>
              ))
            ) : (
              <option value={selectedFromAccount}>{selectedFromAccount}</option>
            )}
          </Form.Select>
          {senderInfo && (
            <div style={{ 
              marginTop: '5px', 
              padding: '8px', 
              backgroundColor: '#F0F0F0', 
              borderRadius: '4px',
              fontSize: '13px'
            }}>
              <strong>Available Balance:</strong> R{senderInfo.balance?.toFixed(2)}
              {!senderInfo.active && (
                <span style={{ color: '#FF0000', marginLeft: '10px' }}>⚠️ Account Inactive</span>
              )}
            </div>
          )}
        </Form.Group>

        {/* To Account Input */}
        <Form.Group className="mb-3">
          <Form.Label>To Account Number</Form.Label>
          <Form.Control
            type="text"
            value={toAccount}
            onChange={(e) => setToAccount(e.target.value)}
            required
            placeholder="Enter recipient's account number"
            style={{
              backgroundColor: '#F5F5F5',
              border: `1px solid ${validationError ? '#FF0000' : '#FFD700'}`,
              padding: '10px',
              borderRadius: '8px'
            }}
          />
          {validating && (
            <div style={{ marginTop: '5px', color: '#666666' }}>Validating account...</div>
          )}
          {recipientInfo && (
            <div style={{ 
              marginTop: '5px', 
              padding: '8px', 
              backgroundColor: '#F0F0F0', 
              borderRadius: '4px'
            }}>
              <div><strong>Account Holder:</strong> {recipientInfo.accountHolder}</div>
              <div><strong>Account Type:</strong> {recipientInfo.accountType}</div>
              {allAccounts.some(acc => acc.accountNumber === toAccount) && (
                <div style={{ color: '#FFD700', fontWeight: '600' }}>
                  ⭐ This is your own account (Internal Transfer)
                </div>
              )}
            </div>
          )}
          {validationError && (
            <div style={{ marginTop: '5px', color: '#FF0000' }}>❌ {validationError}</div>
          )}
        </Form.Group>

        {/* Amount Input */}
        <Form.Group className="mb-3">
          <Form.Label>Amount (R)</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            placeholder="Enter amount in Rands"
            style={{
              backgroundColor: '#F5F5F5',
              border: '1px solid #FFD700',
              padding: '10px',
              borderRadius: '8px'
            }}
          />
        </Form.Group>

        {/* PIN Input */}
        <Form.Group className="mb-3">
          <Form.Label>PIN</Form.Label>
          <Form.Control
            type="password"
            maxLength="4"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            required
            placeholder="Enter your 4-digit PIN"
            style={{
              backgroundColor: '#F5F5F5',
              border: '1px solid #FFD700',
              padding: '10px',
              borderRadius: '8px'
            }}
          />
        </Form.Group>

        {/* Description Input */}
        <Form.Group className="mb-3">
          <Form.Label>Description (Optional)</Form.Label>
          <Form.Control
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Rent payment, Gift, Dinner"
            style={{
              backgroundColor: '#F5F5F5',
              border: '1px solid #FFD700',
              padding: '10px',
              borderRadius: '8px'
            }}
          />
        </Form.Group>

        {/* Quick Amount Buttons */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '10px',
          marginBottom: '20px'
        }}>
          {[50, 100, 200, 500, 1000, 2000].map(amt => (
            <button
              key={amt}
              type="button"
              onClick={() => setAmount(amt.toString())}
              style={{
                backgroundColor: '#F0F0F0',
                border: '1px solid #FFD700',
                padding: '8px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              R{amt}
            </button>
          ))}
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          disabled={loading || validating || !recipientInfo}
          style={{ 
            width: '100%',
            backgroundColor: '#000000',
            border: 'none',
            color: '#FFD700',
            fontWeight: '600',
            padding: '14px',
            borderRadius: '8px',
            fontSize: '16px',
            opacity: (loading || validating || !recipientInfo) ? 0.7 : 1,
            cursor: (loading || validating || !recipientInfo) ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Processing...' : 
           validating ? 'Validating...' : 
           !recipientInfo ? 'Enter recipient account' : 
           'Review Transfer'}
        </Button>
      </Form>

            {/* Confirmation Modal */}
      <Modal 
        show={showConfirmation} 
        onHide={() => setShowConfirmation(false)}
        centered
        style={{ color: '#000000' }}
        backdrop="static"
        className="transfer-modal"
      >
        <Modal.Header closeButton style={{ backgroundColor: '#000000', color: '#FFD700', borderBottom: '2px solid #FFD700' }}>
          <Modal.Title>Confirm Transfer</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#FFFFFF', padding: '25px' }}>
          {transferDetails && (
            <div>
              {/* Amount Display */}
              <div style={{ 
                textAlign: 'center', 
                marginBottom: '25px',
                padding: '25px',
                background: 'linear-gradient(135deg, #000000 0%, #1A1A1A 100%)',
                borderRadius: '12px',
                border: '2px solid #FFD700'
              }}>
                <div style={{ fontSize: '14px', color: '#FFD700', marginBottom: '5px' }}>Amount</div>
                <div style={{ fontSize: '42px', fontWeight: '800', color: '#FFD700' }}>
                  R{transferDetails.amount.toFixed(2)}
                </div>
              </div>

              {/* Transaction Details */}
              <div style={{ 
                backgroundColor: '#F5F5F5', 
                borderRadius: '12px', 
                padding: '20px',
                marginBottom: '20px',
                border: '1px solid #E0E0E0'
              }}>
                {/* From Account */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '15px',
                  paddingBottom: '15px',
                  borderBottom: '1px solid #E0E0E0'
                }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    backgroundColor: '#FFD700', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '15px'
                  }}>
                    <span style={{ fontSize: '20px' }}>⬇️</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#666666' }}>From Account</div>
                    <div style={{ fontSize: '16px', fontWeight: '600' }}>
                      {transferDetails.fromAccount}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666666' }}>
                      {transferDetails.fromAccountHolder || 'Unknown'}
                    </div>
                  </div>
                </div>

                {/* To Account */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  marginBottom: '15px',
                  paddingBottom: '15px',
                  borderBottom: '1px solid #E0E0E0'
                }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    backgroundColor: '#FFD700', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '15px'
                  }}>
                    <span style={{ fontSize: '20px' }}>⬆️</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#666666' }}>To Account</div>
                    <div style={{ fontSize: '16px', fontWeight: '600' }}>
                      {transferDetails.toAccount}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666666' }}>
                      {transferDetails.toAccountHolder || 'Unknown'}
                    </div>
                  </div>
                </div>

                {/* Description */}
                {transferDetails.description && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    marginBottom: '15px',
                    paddingBottom: '15px',
                    borderBottom: '1px solid #E0E0E0'
                  }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      backgroundColor: '#F0F0F0', 
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '15px'
                    }}>
                      <span style={{ fontSize: '20px' }}>📝</span>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#666666' }}>Description</div>
                      <div style={{ fontSize: '16px', fontWeight: '500' }}>
                        {transferDetails.description}
                      </div>
                    </div>
                  </div>
                )}

                {/* Transfer Type */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center'
                }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    backgroundColor: transferDetails.internalTransfer ? '#FFD700' : '#F0F0F0', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '15px'
                  }}>
                    <span style={{ fontSize: '20px' }}>
                      {transferDetails.internalTransfer ? '⭐' : '↔️'}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#666666' }}>Transfer Type</div>
                    <div style={{ 
                      fontSize: '16px', 
                      fontWeight: '600',
                      color: transferDetails.internalTransfer ? '#FFD700' : '#000000'
                    }}>
                      {transferDetails.internalTransfer ? 
                        '⭐ Internal Transfer (Your own account)' : 
                        '↔️ External Transfer (Another user)'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning Message */}
              <div style={{
                backgroundColor: '#FFF3CD',
                border: '1px solid #FFE69C',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '20px',
                color: '#856404',
                fontSize: '13px'
              }}>
                ⚠️ Please verify the recipient account details carefully. Transfers cannot be reversed.
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer style={{ 
          backgroundColor: '#F5F5F5', 
          borderTop: '2px solid #FFD700',
          padding: '15px 25px',
          display: 'flex',
          justifyContent: 'space-between',
          gap: '10px'
        }}>
          <Button 
            variant="secondary" 
            onClick={() => setShowConfirmation(false)}
            style={{ 
              backgroundColor: '#666666', 
              border: 'none',
              padding: '12px 30px',
              fontWeight: '600',
              borderRadius: '8px',
              flex: 1
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={confirmTransfer}
            disabled={loading}
            style={{ 
              backgroundColor: '#000000', 
              border: 'none', 
              color: '#FFD700',
              padding: '12px 30px',
              fontWeight: '600',
              borderRadius: '8px',
              flex: 2
            }}
          >
            {loading ? 'Processing...' : 'Confirm Transfer'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default FundTransfer;