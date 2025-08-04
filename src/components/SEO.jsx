import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

/**
 * A reusable component to manage all SEO-related head tags.
 * @param {object} props
 * @param {string} props.title - The title of the page.
 * @param {string} props.description - A brief description of the page content.
 * @param {string} [props.imageUrl] - The URL for the page's feature image (for social cards).
 * @param {string} [props.author] - The Twitter handle of the author (e.g., @GreenTracerOrg).
 */
export default function SEO({ title, description, imageUrl, author }) {
  // Use a default title and description if none are provided.
  const siteName = 'GreenTracer';
  const defaultDescription = 'Measure and analyze the carbon footprint of any website with our free, real-time carbon calculator. Understand your digital impact and learn how to build a greener web.';
  
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} | Website Carbon Calculator`;
  const finalDescription = description || defaultDescription;
  
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{fullTitle}</title>
      <meta name='description' content={finalDescription} />
      
      {/* Open Graph tags for Facebook, LinkedIn, etc. */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:type" content="website" />
      {imageUrl && <meta property="og:image" content={imageUrl} />}

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={finalDescription} />
      {author && <meta name="twitter:creator" content={author} />}
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}
    </Helmet>
  );
}

// You also need to wrap your entire application in <HelmetProvider>
// This is usually done in your main entry file (e.g., src/main.jsx)