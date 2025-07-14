import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import StatusHero from './components/StatusHero';
import ParameterGrid from './components/ParameterGrid';
import LiveGraphs from './components/LiveGraphs';
import Analytics from './components/Analytics';

const FEATURES = [
  'cpu',
  'memory',
  'disk',
  'temperature',
  'errors',
  'response_time',
  'network',
  'uptime',
  'processes',
  'threads',
];

function App() {
  // Store up to 30 history points (for graphs)
  const [history, setHistory] = useState([]); // Each entry is an array from backend

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5001/live-sequence');
        const data = await res.json();
        if (data.sequence && Array.isArray(data.sequence) && data.sequence.length > 0) {
          setHistory((prev) => [...prev.slice(-29), data.sequence[data.sequence.length - 1]]);
        }
      } catch (e) {
        console.error('Error fetching live data:', e);
      }
    };
    fetchData();
    const timer = setInterval(fetchData, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className='bg-black'>
        <StatusHero history={history} />
        {/* Pass history to ParameterGrid and LiveGraphs */}
        <ParameterGrid history={history} />
        <Analytics />
        <LiveGraphs history={history} />
      </div>
    </div>
  );
}

export default App;
