import React from 'react';

const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <p className="text-xl mb-6">Oops! The page you&apos;re looking for doesn&apos;t exist.</p>
    </div>
  );
};

export default PageNotFound;
