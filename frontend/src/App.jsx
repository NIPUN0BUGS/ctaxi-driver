// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DriverLogin from './pages/DriverLogin';
import DriverUI from './pages/DriverUI'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DriverLogin />} />  
        <Route path="/driver-ui" element={<DriverUI />} /> 
      </Routes>
    </Router>
  );
}

export default App;
