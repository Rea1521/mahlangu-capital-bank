import React from 'react';
import logo from '../assets/logo.png';

function SplashScreen() {
  return (
    <div className="splash-screen">
      <div className="splash-content">
        <img src={logo} alt="Mahlangu Capital Bank" className="splash-logo" />
        <h1 className="splash-title">MAHLANGU CAPITAL BANK</h1>
        <p className="splash-subtitle">Strength. Security. Wealth.</p>
      </div>
    </div>
  );
}

export default SplashScreen;