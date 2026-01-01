import React from 'react';

const Home: React.FC = () => {
    return (
        <div className="px-4 py-6 sm:px-0">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 bg-white border-b border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Welcome to CollectionKing
                    </h1>
                    <p className="text-gray-600 mb-4">
                        This is a monolithic application built with Docker + Laravel + Nginx + MySQL + Vite (React + TypeScript).
                    </p>
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Features:</h2>
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            <li>Single domain architecture (no CORS needed)</li>
                            <li>React Router for client-side routing</li>
                            <li>Vite for fast hot module replacement</li>
                            <li>Laravel API routes at /api/*</li>
                            <li>TypeScript for type safety</li>
                            <li>Tailwind CSS for styling</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
