import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ToggleButton from 'react-toggle-button'; // Import ToggleButton
import '../../assets/css/toolbar.css'; // Import file CSS mới chứa hiệu ứng Aqua

// Import SVG icons
import zoomOutIcon from '../../assets/icons/zoom-out.svg';
import zoomInIcon from '../../assets/icons/zoom-in.svg';
import fullscreenIcon from '../../assets/icons/fullscreen.svg';
import exitFullscreenIcon from '../../assets/icons/exit-fullscreen.svg';

function Toolbar({
  handleZoomOut,
  handleZoomIn,
  toggleFullscreen,
  isFullscreen
}) {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = (value) => {
    setIsToggled(!value);
    // Thực hiện thêm hành động cần thiết khi toggle, ví dụ:
    console.log('Toggled:', !value);
  };

  return (
      <div className="toolbar">
        <button className="toolbar-btn" onClick={handleZoomOut}>
          <img src={zoomOutIcon} alt="Zoom Out" style={styles.icon} />
        </button>
        <button className="toolbar-btn" onClick={handleZoomIn}>
          <img src={zoomInIcon} alt="Zoom In" style={styles.icon} />
        </button>
        <button className="toolbar-btn" onClick={toggleFullscreen}>
          <img
            src={isFullscreen ? exitFullscreenIcon : fullscreenIcon}
            alt={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            style={styles.icon}
          />
        </button>
        <div className="toggle">
          <ToggleButton
            value={isToggled}
            onToggle={handleToggle}
          />
        </div>
      </div>
  );
}

// PropTypes to define the expected types of props
Toolbar.propTypes = {
  handleZoomOut: PropTypes.func.isRequired,
  handleZoomIn: PropTypes.func.isRequired,
  toggleFullscreen: PropTypes.func.isRequired,
  isFullscreen: PropTypes.bool.isRequired
};

const styles = {
  icon: {
    width: '24px',  // Set icon size
    height: '24px',

  }
};

export default Toolbar;
