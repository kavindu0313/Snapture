import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DatabaseTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<{
    status: string;
    message: string;
    database?: string;
    collections?: string[];
    error?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testConnection = async () => {
      try {
        setLoading(true);
        // Try to connect to the database test endpoint
        const response = await axios.get('http://localhost:8080/api/db-test/status', {
          // Add timeout to prevent long waiting time
          timeout: 5000,
          // Add headers for CORS
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        setConnectionStatus(response.data);
      } catch (error) {
        console.error('Error testing database connection:', error);
        // Check if the error is a connection refused error
        const isConnectionRefused = 
          error instanceof Error && 
          error.toString().includes('Network Error');
        
        setConnectionStatus({
          status: 'error',
          message: isConnectionRefused 
            ? 'Failed to connect to the backend server. Please make sure the server is running.'
            : 'Failed to connect to the database',
          error: error instanceof Error ? error.message : String(error)
        });
      } finally {
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-6 max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">MongoDB Atlas Connection Test</h2>
      
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : connectionStatus ? (
        <div>
          <div className={`p-4 mb-4 rounded-md ${
            connectionStatus.status === 'success' 
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
          }`}>
            <p className="font-medium">{connectionStatus.message}</p>
          </div>
          
          {connectionStatus.status === 'success' && (
            <div className="mt-4">
              <p className="text-gray-700 dark:text-gray-300"><span className="font-semibold">Database:</span> {connectionStatus.database}</p>
              
              <div className="mt-2">
                <p className="font-semibold text-gray-700 dark:text-gray-300">Collections:</p>
                {connectionStatus.collections && connectionStatus.collections.length > 0 ? (
                  <ul className="mt-1 list-disc list-inside text-gray-600 dark:text-gray-400">
                    {connectionStatus.collections.map((collection, index) => (
                      <li key={index}>{collection}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">No collections found</p>
                )}
              </div>
            </div>
          )}
          
          {connectionStatus.error && (
            <div className="mt-4">
              <p className="font-semibold text-gray-700 dark:text-gray-300">Error Details:</p>
              <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm text-red-600 dark:text-red-300 overflow-x-auto">
                {connectionStatus.error}
              </pre>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">No connection information available</p>
      )}
    </div>
  );
};

export default DatabaseTest;
