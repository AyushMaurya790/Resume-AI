import React from 'react';
import '../../styles/Loader.css';

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader">
        <div className="loader-circle red"></div>
        <div className="loader-circle blue"></div>
        <div className="loader-circle red"></div>
        <div className="loader-circle blue"></div>
      </div>
      <p className="loader-text">Generating AI Magic...</p>
    </div>
  );
};

export const SmallLoader = () => {
  return (
    <div className="small-loader">
      <div className="small-loader-circle red"></div>
      <div className="small-loader-circle blue"></div>
    </div>
  );
};

export default Loader;