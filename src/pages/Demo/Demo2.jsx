import React, { useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Demo2 = ({ className }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    // Set the canvas size to match the container's width and height
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    const context = canvas.getContext('2d');

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw a rectangle that fills a portion of the canvas (for background)
    context.fillStyle = 'rgba(200, 200, 200, 0.5)'; // Light gray with transparency
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    resizeCanvas();
    // Handle window resizing to resize the canvas properly
    window.addEventListener('resize', resizeCanvas);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return (
    <div className={`demo2-container ${className}`} ref={containerRef} style={{ position: 'relative', height: '100%' }}>
      {/* Positioned absolute and stretched to fit the container */}
      <canvas 
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0 // Lower z-index so it stays behind the table
        }}
      />
      {/* All child components will go here and will appear above the canvas */}
      <div className="content" style={{ position: 'relative', zIndex: 1 }}>
        {/** Your table or other content will be here **/}
      </div>
    </div>
  );
};

export default Demo2;
