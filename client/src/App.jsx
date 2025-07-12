import React from 'react'
import './App.css'
import Navbar from './components/Navbar'
import StatusHero from './components/StatusHero'
import ParameterGrid from './components/ParameterGrid'
import LiveGraphs from './components/LiveGraphs';

function App() {
  return (
    
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Main content */}
      <div className='bg-black'>
        
        {/* Live Graphs Section */}
        <LiveGraphs />
        {/* Hero Section with Status */}
        <StatusHero />
        
        {/* Parameter Grid Section */}
        <ParameterGrid />
        
      </div>
    </div>
  )
}

export default App
