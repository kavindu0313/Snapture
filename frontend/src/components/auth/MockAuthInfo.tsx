import React from 'react';

const MockAuthInfo: React.FC = () => {
  return (
    <div className="p-4 mb-4 text-sm text-blue-700 bg-blue-100 rounded-lg">
      <div className="font-medium">Mock Authentication Mode</div>
      <p className="mt-1">
        You can use any of the following test accounts:
      </p>
      <ul className="list-disc pl-5 mt-1">
        <li><strong>Username:</strong> user1, <strong>Password:</strong> password</li>
        <li><strong>Username:</strong> user2, <strong>Password:</strong> password</li>
      </ul>
      <p className="mt-1">
        Or register a new account - all data will be stored in your browser's localStorage.
      </p>
    </div>
  );
};

export default MockAuthInfo;
