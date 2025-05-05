import React, { useState, useEffect } from 'react';
import { setUseMockApi } from '../services/apiConfig';

const ApiToggle: React.FC = () => {
  const [useMock, setUseMock] = useState<boolean>(true);
  const [backendStatus, setBackendStatus] = useState<'available' | 'unavailable' | 'checking'>('checking');

  // Check backend status
  const checkBackendStatus = async () => {
    setBackendStatus('checking');
    try {
      const response = await fetch('http://localhost:8080/api/ping', { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(2000)
      });
      setBackendStatus(response.ok ? 'available' : 'unavailable');
    } catch (error) {
      setBackendStatus('unavailable');
    }
  };

  // Toggle between mock and real API
  const toggleApiMode = () => {
    const newMode = !useMock;
    setUseMock(newMode);
    setUseMockApi(newMode);
  };

  // Check status on mount and periodically
  useEffect(() => {
    checkBackendStatus();
    const interval = setInterval(checkBackendStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col items-start space-y-2">
        <div className="flex items-center justify-between w-full">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">API Mode:</span>
          <button
            onClick={toggleApiMode}
            className={`px-3 py-1 rounded-md text-xs font-medium ${
              useMock 
                ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                : 'bg-green-100 text-green-800 hover:bg-green-200'
            }`}
          >
            {useMock ? 'Using Mock API' : 'Using Real API'}
          </button>
        </div>
        
        <div className="flex items-center justify-between w-full">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Backend Status:</span>
          <div className="flex items-center">
            <span 
              className={`h-2 w-2 rounded-full mr-2 ${
                backendStatus === 'available' 
                  ? 'bg-green-500' 
                  : backendStatus === 'unavailable' 
                    ? 'bg-red-500' 
                    : 'bg-yellow-500 animate-pulse'
              }`}
            />
            <span className="text-xs font-medium">
              {backendStatus === 'available' 
                ? 'Available' 
                : backendStatus === 'unavailable' 
                  ? 'Unavailable' 
                  : 'Checking...'}
            </span>
          </div>
        </div>
        
        <button
          onClick={checkBackendStatus}
          className="w-full px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded"
        >
          Refresh Status
        </button>
      </div>
    </div>
  );
};

export default ApiToggle;
