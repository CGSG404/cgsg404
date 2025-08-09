'use client';

import { useEffect, useState } from 'react';

const SimpleAuthError = () => {
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const errorParam = urlParams.get('error');
      const detailsParam = urlParams.get('details');
      
      if (errorParam) {
        setError(errorParam);
        setDetails(detailsParam);
        setIsVisible(true);
      }
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    if (typeof window !== 'undefined') {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  };

  const handleRetry = () => {
    setIsVisible(false);
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  if (!error || !isVisible) return null;

  const getErrorMessage = () => {
    switch (error) {
      case 'callback_failed':
        return 'Authentication callback failed. Please try logging in again.';
      case 'auth_failed':
        return 'Google authentication was not successful. Please try again.';
      case 'session_failed':
        return 'Unable to create session. Please try logging in again.';
      case 'no_code':
        return 'No authorization code received. Please try again.';
      case 'invalid_code':
        return 'Invalid authorization code format. Please try again.';
      case 'auth_retry':
        return 'OAuth data format issue detected. Please try signing in again.';
      default:
        return 'An authentication error occurred. Please try again.';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: '#1a1a1a',
        border: '1px solid #ef4444',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '400px',
        width: '100%',
        color: 'white'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              Warning
            </div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              margin: 0
            }}>
              Authentication Error
            </h3>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '6px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#9ca3af';
            }}
          >
            ✕
          </button>
        </div>

        {/* Error Message */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{
            color: '#d1d5db',
            marginBottom: '12px',
            lineHeight: '1.5'
          }}>
            {getErrorMessage()}
          </p>
        </div>

        {/* Technical Details */}
        {details && (
          <div style={{
            marginBottom: '20px',
            padding: '12px',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '8px',
            border: '1px solid #374151'
          }}>
            <h4 style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#d1d5db',
              marginBottom: '8px',
              margin: 0
            }}>
              Technical Details:
            </h4>
            <p style={{
              fontSize: '12px',
              color: '#9ca3af',
              fontFamily: 'monospace',
              wordBreak: 'break-all',
              margin: 0
            }}>
              {decodeURIComponent(details)}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px'
        }}>
          <button
            onClick={handleRetry}
            style={{
              flex: 1,
              backgroundColor: '#00ff88',
              color: '#000',
              border: 'none',
              padding: '12px 16px',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#00e67a';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#00ff88';
            }}
          >
            <span>Refresh</span>
            <span>Try Again</span>
          </button>
          <button
            onClick={handleClose}
            style={{
              flex: 1,
              backgroundColor: '#4b5563',
              color: 'white',
              border: 'none',
              padding: '12px 16px',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#6b7280';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#4b5563';
            }}
          >
            <span>Home</span>
            <span>Continue</span>
          </button>
        </div>

        {/* Debug Info (Development Only) */}
        {process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && (
          <div style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '8px'
          }}>
            <h4 style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#fbbf24',
              marginBottom: '8px',
              margin: 0
            }}>
              Debug Info:
            </h4>
            <div style={{
              fontSize: '12px',
              color: '#fde047',
              lineHeight: '1.4'
            }}>
              <div>Error Type: {error}</div>
              <div>Current URL: {window.location.href}</div>
              <div>Origin: {window.location.origin}</div>
              <div>Timestamp: {new Date().toISOString()}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleAuthError;
