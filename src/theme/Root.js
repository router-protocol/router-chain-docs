import React from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import {useLocation} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function Root({children}) {
  const isBrowser = useIsBrowser();
  const location = useLocation();
  const {siteConfig} = useDocusaurusContext();

  React.useEffect(() => {
    if (isBrowser) {
      const updateCanonical = () => {
        const canonicalElement = document.querySelector('link[rel="canonical"]');
        const baseUrl = siteConfig.url;
        const canonicalUrl = `${baseUrl}${location.pathname}`;
        
        console.log('Updating canonical URL - v2');
        console.log('Base URL:', baseUrl);
        console.log('Current pathname:', location.pathname);
        console.log('Full URL:', window.location.href);
        
        if (canonicalElement) {
          console.log('Existing canonical element found, updating href');
          canonicalElement.setAttribute('href', canonicalUrl);
        } else {
          console.log('No existing canonical element, creating new one');
          const link = document.createElement('link');
          link.setAttribute('rel', 'canonical');
          link.setAttribute('href', canonicalUrl);
          document.head.appendChild(link);
        }
        
        console.log('Updated Canonical URL:', canonicalUrl);
      };

      // Update on initial load
      updateCanonical();

      // Update on location changes
      const unlisten = () => {
        updateCanonical(); // Call the update function whenever location changes
      };

      // Use a custom listener for location changes
      const unsubscribe = location.pathname; // This will trigger re-render on path change

      return () => {
        // Cleanup if necessary
      };
    }
  }, [isBrowser, location.pathname, siteConfig.url]); // Listen to pathname changes

  return <>{children}</>;
}
