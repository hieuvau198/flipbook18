import React, { useState } from 'react';
import "../../styles/App.css";

const ShareButton = () => {
  const [buttonText, setButtonText] = useState('Share');

  const handleShareClick = () => {
    const currentUrl = window.location.href; // Get the current page URL

    // Use the clipboard API to copy the URL
    navigator.clipboard.writeText(currentUrl).then(
      () => {
        // If copy is successful, change the button text
        setButtonText('Copied');
        
        // Reset the button text after 3 seconds
        setTimeout(() => {
          setButtonText('Share');
        }, 3000);
      },
      (err) => {
        console.error('Failed to copy the URL: ', err);
      }
    );
  };

  return (
    <button onClick={handleShareClick} className='book-style-button'>
      {buttonText}
    </button>
  );
};

export default ShareButton;
