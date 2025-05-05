import React from 'react';
import ApiConnectionTest from '../components/ApiConnectionTest';
import AuthTest from '../components/AuthTest';

const TestConnectionPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-8 text-gray-800 dark:text-white">
        PhotoShare API Connection Test
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <ApiConnectionTest />
        </div>
        <div>
          <AuthTest />
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
          How to Use This Test Page
        </h2>
        <ul className="list-disc pl-5 text-blue-700 dark:text-blue-300 space-y-1">
          <li>The API Connection Test checks if your backend is running and accessible</li>
          <li>The Authentication Test allows you to test login and registration</li>
          <li>Make sure your Spring Boot backend is running on http://localhost:8080/api</li>
          <li>If you see connection errors, check your backend logs for details</li>
          <li>After successful login, the JWT token will be stored in localStorage</li>
        </ul>
      </div>
    </div>
  );
};

export default TestConnectionPage;
