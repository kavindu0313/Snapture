import React, { useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const ApiConnectionTest: React.FC = () => {
  const [pingStatus, setPingStatus] = useState<string>('Loading...');
  const [apiStatus, setApiStatus] = useState<string>('Loading...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Test the ping endpoint
    authAPI.ping()
      .then(data => {
        setPingStatus(`Connected! Backend says: ${data.message}`);
      })
      .catch(err => {
        setPingStatus(`Connection failed: ${err.message}`);
        setError('Failed to connect to the ping endpoint. Make sure your backend is running.');
      });

    // Test the API status endpoint
    authAPI.status()
      .then(data => {
        setApiStatus(`API Status: ${data.message}`);
      })
      .catch(err => {
        setApiStatus(`API Status check failed: ${err.message}`);
      });
  }, []);

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md dark:bg-gray-800 my-8">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">API Connection Test</h2>
      
      <div className="mb-4">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300">Ping Endpoint:</h3>
        <p className={`mt-1 ${pingStatus.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>
          {pingStatus}
        </p>
      </div>
      
      <div className="mb-4">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300">API Status:</h3>
        <p className={`mt-1 ${apiStatus.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>
          {apiStatus}
        </p>
      </div>
      
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md mt-4">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
          <p className="mt-2 text-sm">
            Make sure your Spring Boot backend is running on http://localhost:8080/api
          </p>
        </div>
      )}
    </div>
  );
};

export default ApiConnectionTest;
