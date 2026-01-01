import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Menu from './pages/Menu';
import Collection from './pages/Collection';
import Deck from './pages/Deck';
import Battle from './pages/Battle';

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Menu />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/deck" element={<Deck />} />
            <Route path="/battle" element={<Battle />} />
            <Route path="*" element={<Menu />} />
        </Routes>
    );
};

export default App;
