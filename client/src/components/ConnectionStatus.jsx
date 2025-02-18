import { useState, useEffect } from 'react';
import { wakeupServer } from '../utils/wakeupServer';

const ConnectionStatus = () => {
  const [status, setStatus] = useState('connecting'); // 'connecting' | 'connected' | 'failed'

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await wakeupServer();
        setStatus('connected');
      } catch (error) {
        setStatus('failed');
      }
    };

    const timer = setTimeout(() => {
      checkConnection();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (status === 'connected' && window.innerWidth < 768) {
    return null; // Hide on mobile after connection
  }

  return (
    <div className={`fixed top-4 left-4 z-50 rounded-lg shadow-lg px-4 py-2 flex items-center gap-2 ${
      status === 'connected' ? 'bg-green-50 text-green-700' : 
      status === 'failed' ? 'bg-red-50 text-red-700' : 
      'bg-blue-50 text-blue-700'
    }`}>
      {status === 'connecting' && (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          <span>Connecting to backend...</span>
        </>
      )}
      {status === 'connected' && (
        <>
          <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Connected to backend</span>
        </>
      )}
      {status === 'failed' && (
        <>
          <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>Connection failed</span>
        </>
      )}
    </div>
  );
};

export default ConnectionStatus;