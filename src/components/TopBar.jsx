import React from 'react';
import '../styles/TopBar.css'; // External CSS for custom styling

function TopBar() {
  return (
    <div className="top-bar">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 text-center">
            <span className="brand-name">
              🧥 Experience Dexter — <span className="tagline">Where Leather Meets Legacy.</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
