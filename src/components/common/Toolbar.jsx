import React from 'react';
import PropTypes from 'prop-types';
import '../../assets/css/toolbar.css'; // Import file CSS mới chứa hiệu ứng Aqua

// Import SVG icons
import previousIcon from '../../assets/icons/previous.svg';
import nextIcon from '../../assets/icons/next.svg';
import zoomOutIcon from '../../assets/icons/zoom-out.svg';
import zoomInIcon from '../../assets/icons/zoom-in.svg';
import fullscreenIcon from '../../assets/icons/fullscreen.svg';
import exitFullscreenIcon from '../../assets/icons/exit-fullscreen.svg';


function Toolbar({
  handlePreviousPage,
  handleNextPage,
  handleZoomOut,
  handleZoomIn,
  toggleFullscreen,
  isFullscreen,

}) {
  return (
    <div className="d-flex justify-content-center align-items-center mb-2">
      <div className="toolbar">
        <button className="toolbar-btn mx-1" onClick={handlePreviousPage}>
          <img src={previousIcon} alt="Previous" style={styles.icon} />
        </button>
        <button className="toolbar-btn mx-1" onClick={handleNextPage}>
          <img src={nextIcon} alt="Next" style={styles.icon} />
        </button>
        <button className="toolbar-btn mx-1" onClick={handleZoomOut}>
          <img src={zoomOutIcon} alt="Zoom Out" style={styles.icon} />
        </button>
        <button className="toolbar-btn mx-1" onClick={handleZoomIn}>
          <img src={zoomInIcon} alt="Zoom In" style={styles.icon} />
        </button>
        <button className="toolbar-btn mx-1" onClick={toggleFullscreen}>
          <img
            src={isFullscreen ? exitFullscreenIcon : fullscreenIcon}
            alt={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            style={styles.icon}
          />
        </button>
      </div>
    </div>
  );
}

// PropTypes to define the expected types of props
Toolbar.propTypes = {
  handlePreviousPage: PropTypes.func.isRequired,
  handleNextPage: PropTypes.func.isRequired,
  handleZoomOut: PropTypes.func.isRequired,
  handleZoomIn: PropTypes.func.isRequired,
  toggleFullscreen: PropTypes.func.isRequired,
  isFullscreen: PropTypes.bool.isRequired,
};

const styles = {
  icon: {
    width: '24px',  // Set icon size
    height: '24px',
  }
};

export default Toolbar;
