import React from 'react';
import '../App.css';
import logo from './assets/logo1.png';

const Header = () => {
  return (
    <header className="main-header">
      <div className="header-left">
        <img src={logo} alt="Shree Krishna Computer Logo" className="header-logo" />
      </div>
      <div className="header-info">
        <h1 className="header-title">SHREE KRISHNA COMPUTER</h1>
        <p className="header-address">
          Shop No.7/8, Shreepal Vishesh Bldg. No.5 Nr. Om plaza,S.T Depot Rd., Bharat Gas Agency,
          Nalasopara(W), Palghar -401203 nalasopara, Maharashtra 401203
        </p>
        <p className="header-phone">Contact : 8087375266 or 9699416823</p>
      </div>
      <div className="header-right">
      </div>
    </header>
  );
};

export default Header;