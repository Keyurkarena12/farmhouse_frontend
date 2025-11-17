import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { googleLogin } from '../../store/slices/authSlice';
import { FcGoogle } from 'react-icons/fc';
import './GoogleLoginButton.css'; // Add this CSS file


const GoogleLoginButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const buttonRef = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [googleAvailable, setGoogleAvailable] = useState(false);

  useEffect(() => {
    // Check if Google script is already loaded
    if (window.google) {
      setScriptLoaded(true);
      setGoogleAvailable(true);
      initializeGoogleSignIn();
      return;
    }

    // Load Google Identity Services script
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('✅ Google script loaded successfully');
        setScriptLoaded(true);
        setGoogleAvailable(true);
        // Small delay to ensure Google is fully initialized
        setTimeout(initializeGoogleSignIn, 100);
      };
      script.onerror = (error) => {
        console.error('❌ Failed to load Google script:', error);
        setScriptLoaded(true);
        setGoogleAvailable(false);
      };
      
      document.head.appendChild(script);
    };

    loadGoogleScript();

    return () => {
      // Cleanup if needed
    };
  }, []);

  const initializeGoogleSignIn = () => {
    if (!window.google || !buttonRef.current) {
      console.log('⚠️ Google not available or button ref missing');
      return;
    }

    try {
       const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      
      if (!clientId) {
        console.error('❌ Google Client ID is missing');
        return;
      }

      console.log('🔧 Initializing Google Sign-In with client ID:', clientId.substring(0, 10) + '...');

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: false
      });

      // Render the button
      window.google.accounts.id.renderButton(
        buttonRef.current,
        {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'continue_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          type: 'standard'
        }
      );

      console.log('✅ Google Sign-In button rendered successfully');
      
    } catch (error) {
      console.error('❌ Error initializing Google Sign-In:', error);
    }
  };

  const handleGoogleResponse = async(response) => {
    console.log('🔐 Google Sign-In Response Received');
    
    if (!response.credential) {
      console.error('❌ No credential in Google response');
      return;
    }

    // dispatch(googleLogin(response.credential))
    dispatch(googleLogin( response.credential))
      .unwrap()
      .then((userData) => {
        console.log('✅ Google login successful:', userData.user?.email);
        navigate('/');
      })
      .catch((error) => {
        console.error('❌ Google login failed:', error);
        alert('Google login failed: ' + (error || 'Unknown error'));
      });
  };

  // Fallback manual Google login
  const handleManualGoogleLogin = () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    } else {
      console.error('Google Sign-In not available');
      alert('Google Sign-In is not available. Please check your connection and try again.');
    }
  };

  return (
    <div className="google-login-container">
      {/* Primary Google Button Container */}
      <div 
        ref={buttonRef} 
        className="google-button-wrapper"
        style={{ 
          minHeight: '44px',
          display: scriptLoaded && googleAvailable ? 'block' : 'none'
        }}
      >
        {/* Google button will be rendered here automatically */}
      </div>

      {/* Loading State */}
      {!scriptLoaded && (
        <button
          type="button"
          disabled
          className="google-button-loading"
        >
          <div className="loading-spinner"></div>
          Loading Google Sign-In...
        </button>
      )}

      {/* Fallback Button - Shows if script loaded but Google not available */}
      {scriptLoaded && !googleAvailable && (
        <button
          type="button"
          onClick={handleManualGoogleLogin}
          className="google-fallback-button"
        >
          <FcGoogle className="google-icon" />
          Continue with Google
        </button>
      )}

      {/* Debug Info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-info">
          <small>
            Script: {scriptLoaded ? '✅' : '❌'} | 
            Google: {googleAvailable ? '✅' : '❌'} | 
            Client ID: {import.meta.env.VITE_GOOGLE_CLIENT_ID ? '✅' : '❌'}
          </small>
        </div>
      )}
    </div>
  );
};

export default GoogleLoginButton;