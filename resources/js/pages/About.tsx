import React from 'react';

const About: React.FC = () => {
    return (
        <div className="px-4 py-6 sm:px-0">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 bg-white border-b border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        About This Project
                    </h1>
                    <p className="text-gray-600 mb-4">
                        This application demonstrates a modern monolithic architecture combining Laravel backend with React frontend.
                    </p>
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Technology Stack:</h2>
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            <li><strong>Backend:</strong> Laravel 11 (PHP 8.3)</li>
                            <li><strong>Frontend:</strong> React 18 with TypeScript</li>
                            <li><strong>Routing:</strong> React Router for SPA navigation</li>
                            <li><strong>Build Tool:</strong> Vite 6</li>
                            <li><strong>Database:</strong> MySQL 8.0</li>
                            <li><strong>Web Server:</strong> Nginx (proxying to PHP-FPM and Vite)</li>
                            <li><strong>Containerization:</strong> Docker & Docker Compose</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
