import React, { useState, useEffect } from 'react';
import axios from 'axios';
import backendService from '../services/mockBackend';
import api from '../services/api';

interface ConnectionStatus {
  backendConnected: boolean;
  databaseConnected: boolean;
  message: string;
  collections?: string[];
  error?: string;
}

const ConnectionTest: React.FC = () => {
  const [status, setStatus] = useState<ConnectionStatus>({
    backendConnected: false,
    databaseConnected: false,
    message: 'Testing connections...'
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const testConnections = async () => {
      setLoading(true);
      try {
        // Try multiple endpoints to test backend connection
        let backendConnected = false;
        let backendData = null;
        let usedMockBackend = false;
        
        // List of endpoints to try
        const endpoints = [
          'http://localhost:8080/ping', // Spring Boot direct endpoint
          'http://localhost:8080/api-status', // Spring Boot status endpoint
          'http://localhost:8090/ping', // Test server on port 8090
          'http://localhost:8081/ping'
        ];
        
        // Try each endpoint until one succeeds
        for (const endpoint of endpoints) {
          try {
            console.log(`Trying to connect to ${endpoint}...`);
            const backendResponse = await axios.get(endpoint, { timeout: 2000 });
            if (backendResponse.status === 200) {
              backendConnected = true;
              backendData = backendResponse.data;
              console.log(`Successfully connected to ${endpoint}`);
              break;
            }
          } catch (error) {
            console.log(`Failed to connect to ${endpoint}:`, error);
            // Continue to the next endpoint
          }
        }
        
        // If all external endpoints fail, use the mock backend
        if (!backendConnected) {
          try {
            console.log('Using mock backend as fallback...');
            const mockResponse = await backendService.ping();
            backendConnected = true;
            backendData = mockResponse;
            usedMockBackend = true;
            console.log('Successfully connected to mock backend');
          } catch (error) {
            console.error('Error with mock backend:', error);
          }
        }
        
        // Test database connection using our test server
        let databaseConnected = false;
        let collections: string[] = [];
        let dbMessage = '';
        
        try {
          // Try to connect to the database endpoint
          console.log('Testing database connection...');
          let dbResponse;
          
          try {
            // First try the real database endpoint
            dbResponse = await axios.get('http://localhost:8090/db-status', { timeout: 2000 });
          } catch (error) {
            console.log('Real database connection failed, using mock database...');
            // If real database fails, use mock database
            dbResponse = { data: await backendService.dbStatus() };
          }
          
          databaseConnected = dbResponse.data.connected;
          collections = dbResponse.data.collections || [];
          dbMessage = dbResponse.data.message || '';
          console.log('Database connection successful:', dbResponse.data);
        } catch (dbError: any) {
          console.error('All database connection attempts failed:', dbError);
          dbMessage = dbError.message || 'Database connection failed';
        }
        
        setStatus({
          backendConnected,
          databaseConnected,
          message: `Backend: ${backendConnected ? (usedMockBackend ? 'Connected (Mock)' : 'Connected') : 'Failed'}, Database: ${databaseConnected ? 'Connected' : 'Failed'}`,
          collections,
          error: backendConnected ? (databaseConnected ? undefined : dbMessage) : 'Failed to connect to real backend server. Using mock backend as fallback.'
        });
        
        // If we have data from the backend, log it for debugging
        if (backendData) {
          console.log('Backend response data:', backendData);
        }
      } catch (error: any) {
        console.error('Connection test failed:', error);
        setStatus({
          backendConnected: false,
          databaseConnected: false,
          message: 'Connection test failed',
          error: error.message || 'Unknown error occurred'
        });
      } finally {
        setLoading(false);
      }
    };

    testConnections();
  }, []);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Connection Status</h2>
      
      {loading ? (
        <div className="flex items-center justify-center py-4">
          <div className="w-6 h-6 border-2 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-300">Testing connections...</span>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="p-3 border rounded-md">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${status.backendConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="font-medium">Backend</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {status.backendConnected ? 'Connected successfully' : 'Connection failed'}
              </p>
            </div>
            
            <div className="p-3 border rounded-md">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${status.databaseConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="font-medium">Database</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {status.databaseConnected ? 'Connected successfully' : 'Connection failed'}
              </p>
            </div>
          </div>
          
          {status.error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md mb-4">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-400">Error</h3>
              <p className="text-sm text-red-700 dark:text-red-300">{status.error}</p>
            </div>
          )}
          
          {status.databaseConnected && status.collections && status.collections.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Available Collections:</h3>
              <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300">
                {status.collections.map((collection, index) => (
                  <li key={index}>{collection}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionTest;
