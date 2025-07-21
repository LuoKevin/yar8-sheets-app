import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import NameGrid from './components/NameGrid';

const rows = [
  ['Alice','Bob','Charlie'],
  ['Dave','Eve','Frank'],
  ['Grace','Heidi','Ivan'],
];



const App = () => {
  const [names] = useState([
    "Emma", "Liam", "Olivia", "Noah", "Ava",
    "William", "Sophia", "James", "Isabella", "Benjamin",
    "Mia", "Lucas", "Charlotte", "Henry", "Amelia",
    "Alexander", "Harper", "Michael", "Evelyn"
  ]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Floating Name Grid
      </h1>
      <NameGrid initialNames={names} />
    </div>
  );
};

export default App;
