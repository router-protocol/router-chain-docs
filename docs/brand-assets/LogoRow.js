import React, { useState } from 'react';
import { FaEye, FaDownload } from 'react-icons/fa';
import './LogoRow.css'; 

const LogoRow = ({ icon, name, viewSrc, downloadSrc, isSvg }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleView = () => setShowPopup(true);
  const handleDownload = async () => {
    if (isSvg) {
      try {
        console.log('Downloading SVG file:', downloadSrc);
        const response = await fetch(downloadSrc);
        if (!response.ok) throw new Error('Network response was not ok');
        const content = await response.text();
        
        // Log the first 200 characters of the content
        console.log('File content (first 200 chars):', content.substring(0, 200));

        // // Check if the content is actually SVG
        if (!content.trim().toLowerCase().startsWith('<svg')) {
          throw new Error('The downloaded content is not a valid SVG file');
        }

        const blob = new Blob([content], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${name}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Download failed:', error);
        setErrorMessage(`Failed to download the SVG file: ${error.message}`);
      }
    } else {
      // Existing download logic for non-SVG files
      // ... (keep the existing code for non-SVG files)
    }
  };

  return (
    <div className="logo-row">
      <div className="logo-icon">{icon}</div>
      <div className="logo-name">{name}</div>
      <div className="logo-actions">
        <button onClick={handleView}><FaEye /></button>
        <button onClick={handleDownload}><FaDownload /></button>
      </div>
      {showPopup && (
        <div className="popup" onClick={() => setShowPopup(false)}>
          {isSvg ? (
            <div className="svg-container">
              {viewSrc}
            </div>
          ) : (
            <img src={viewSrc} alt={name} />
          )}
        </div>
      )}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default LogoRow;