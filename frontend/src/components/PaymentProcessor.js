import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './PaymentProcessor.css';

const PaymentProcessor = ({ appointment, onPaymentSuccess, onCancel }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    }
  });
  const [processing, setProcessing] = useState(false);
  const [useWallet, setUseWallet] = useState(false);

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validatePaymentData = () => {
    if (paymentMethod === 'card') {
      const cardNumber = paymentData.cardNumber.replace(/\s/g, '');
      if (cardNumber.length < 13 || cardNumber.length > 19) {
        toast.error('Please enter a valid card number');
        return false;
      }
      if (!paymentData.expiryDate.includes('/') || paymentData.expiryDate.length !== 5) {
        toast.error('Please enter a valid expiry date (MM/YY)');
        return false;
      }
      if (paymentData.cvv.length < 3 || paymentData.cvv.length > 4) {
        toast.error('Please enter a valid CVV');
        return false;
      }
      if (!paymentData.cardholderName.trim()) {
        toast.error('Please enter the cardholder name');
        return false;
      }
    }
    return true;
  };

  const simulatePaymentProcessing = () => {
    return new Promise((resolve) => {
      // Simulate payment processing delay
      setTimeout(() => {
        // 95% success rate for demo
        const success = Math.random() > 0.05;
        resolve(success);
      }, 2000);
    });
  };

  const handleInputChange = (field, value) => {
    if (field === 'cardNumber') {
      value = formatCardNumber(value);
    } else if (field === 'expiryDate') {
      value = formatExpiryDate(value);
    } else if (field === 'cvv') {
      value = value.replace(/[^0-9]/g, '').substring(0, 4);
    }

    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setPaymentData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setPaymentData(prev => ({ ...prev, [field]: value }));
    }
  };

  const processPayment = async () => {
    if (!validatePaymentData()) return;

    setProcessing(true);
    try {
      const paymentSuccess = await simulatePaymentProcessing();
      
      if (paymentSuccess) {
        // Create payment record
        const paymentRecord = {
          appointmentId: appointment._id,
          amount: appointment.consultationFee,
          paymentMethod,
          status: 'completed',
          transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          ...(paymentMethod === 'card' && {
            cardLast4: paymentData.cardNumber.slice(-4),
            cardType: getCardType(paymentData.cardNumber)
          })
        };

        // Save payment to backend
        const response = await fetch('/api/payments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(paymentRecord)
        });

        if (response.ok) {
          toast.success('Payment processed successfully!');
          onPaymentSuccess(paymentRecord);
        } else {
          throw new Error('Failed to save payment record');
        }
      } else {
        toast.error('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const getCardType = (cardNumber) => {
    const number = cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'Visa';
    if (number.startsWith('5') || number.startsWith('2')) return 'Mastercard';
    if (number.startsWith('3')) return 'American Express';
    return 'Unknown';
  };

  const handleWalletPayment = async () => {
    setProcessing(true);
    try {
      // Simulate wallet payment (Apple Pay, Google Pay, etc.)
      const paymentSuccess = await simulatePaymentProcessing();
      
      if (paymentSuccess) {
        const paymentRecord = {
          appointmentId: appointment._id,
          amount: appointment.consultationFee,
          paymentMethod: 'wallet',
          status: 'completed',
          transactionId: `wallet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString()
        };

        const response = await fetch('/api/payments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(paymentRecord)
        });

        if (response.ok) {
          toast.success('Wallet payment processed successfully!');
          onPaymentSuccess(paymentRecord);
        }
      } else {
        toast.error('Wallet payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Wallet payment error:', error);
      toast.error('Wallet payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="payment-processor">
      <div className="payment-header">
        <h2>Complete Your Payment</h2>
        <button className="close-btn" onClick={onCancel}>×</button>
      </div>

      <div className="appointment-summary">
        <h3>Appointment Details</h3>
        <div className="summary-row">
          <span>Doctor:</span>
          <span>Dr. {appointment.doctorId.userId.name}</span>
        </div>
        <div className="summary-row">
          <span>Specialization:</span>
          <span>{appointment.doctorId.specialization}</span>
        </div>
        <div className="summary-row">
          <span>Date:</span>
          <span>{new Date(appointment.date).toLocaleDateString()}</span>
        </div>
        <div className="summary-row">
          <span>Time:</span>
          <span>{appointment.time}</span>
        </div>
        <div className="summary-row total">
          <span>Consultation Fee:</span>
          <span>${appointment.consultationFee}</span>
        </div>
      </div>

      <div className="payment-methods">
        <h3>Payment Method</h3>
        <div className="method-options">
          <label className={`method-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
            <input
              type="radio"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span className="method-icon">💳</span>
            <span>Credit/Debit Card</span>
          </label>
          
          <label className={`method-option ${paymentMethod === 'insurance' ? 'selected' : ''}`}>
            <input
              type="radio"
              value="insurance"
              checked={paymentMethod === 'insurance'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span className="method-icon">🏥</span>
            <span>Insurance</span>
          </label>
        </div>
      </div>

      {paymentMethod === 'card' && (
        <div className="card-payment-form">
          <div className="form-group">
            <label>Card Number</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={paymentData.cardNumber}
              onChange={(e) => handleInputChange('cardNumber', e.target.value)}
              maxLength="19"
              className="card-input"
            />
            <div className="card-type">{getCardType(paymentData.cardNumber)}</div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={paymentData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                maxLength="5"
              />
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input
                type="text"
                placeholder="123"
                value={paymentData.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value)}
                maxLength="4"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Cardholder Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={paymentData.cardholderName}
              onChange={(e) => handleInputChange('cardholderName', e.target.value)}
            />
          </div>

          <div className="billing-address">
            <h4>Billing Address</h4>
            <div className="form-group">
              <label>Street Address</label>
              <input
                type="text"
                placeholder="123 Main St"
                value={paymentData.billingAddress.street}
                onChange={(e) => handleInputChange('billingAddress.street', e.target.value)}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  placeholder="New York"
                  value={paymentData.billingAddress.city}
                  onChange={(e) => handleInputChange('billingAddress.city', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  placeholder="NY"
                  value={paymentData.billingAddress.state}
                  onChange={(e) => handleInputChange('billingAddress.state', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>ZIP Code</label>
                <input
                  type="text"
                  placeholder="10001"
                  value={paymentData.billingAddress.zipCode}
                  onChange={(e) => handleInputChange('billingAddress.zipCode', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {paymentMethod === 'insurance' && (
        <div className="insurance-form">
          <div className="insurance-info">
            <h4>Insurance Information</h4>
            <p>Please contact your insurance provider to verify coverage for this consultation.</p>
            <div className="insurance-options">
              <div className="insurance-option">
                <span>💡 Most insurance plans cover specialist consultations</span>
              </div>
              <div className="insurance-option">
                <span>📞 Call your insurance: 1-800-XXX-XXXX</span>
              </div>
              <div className="insurance-option">
                <span>⏰ Coverage verification usually takes 24-48 hours</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="wallet-payment">
        <div className="wallet-divider">
          <span>or pay with</span>
        </div>
        <div className="wallet-options">
          <button 
            className="wallet-btn apple-pay"
            onClick={handleWalletPayment}
            disabled={processing}
          >
            🍎 Apple Pay
          </button>
          <button 
            className="wallet-btn google-pay"
            onClick={handleWalletPayment}
            disabled={processing}
          >
            G Google Pay
          </button>
          <button 
            className="wallet-btn paypal"
            onClick={handleWalletPayment}
            disabled={processing}
          >
            PayPal
          </button>
        </div>
      </div>

      <div className="payment-actions">
        <button className="cancel-btn" onClick={onCancel} disabled={processing}>
          Cancel
        </button>
        <button 
          className="pay-btn"
          onClick={paymentMethod === 'card' ? processPayment : handleWalletPayment}
          disabled={processing}
        >
          {processing ? (
            <span className="processing">
              <span className="spinner"></span>
              Processing...
            </span>
          ) : (
            `Pay $${appointment.consultationFee}`
          )}
        </button>
      </div>

      <div className="payment-security">
        <div className="security-badges">
          <span className="security-badge">🔒 SSL Encrypted</span>
          <span className="security-badge">🛡️ PCI Compliant</span>
          <span className="security-badge">✅ HIPAA Secure</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessor;