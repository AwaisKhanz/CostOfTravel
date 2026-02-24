import React from 'react';

interface SchemaMarkupProps {
  title: string;
  description: string;
  url: string;
  providerName?: string;
}

// Banned Schemas in Cost of Travel: Product, Review, Offer.
// Only using WebPage, BreadcrumbList, and FAQPage.

export const SchemaMarkup: React.FC<SchemaMarkupProps> = ({ 
  title, 
  description, 
  url,
  providerName 
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": url,
    "publisher": {
      "@type": "Organization",
      "name": "Cost of Travel",
      "logo": {
        "@type": "ImageObject",
        "url": "https://costoftravel.com/logo.png"
      }
    },
    ...(providerName && {
      "about": {
        "@type": "Organization",
        "name": providerName
      }
    })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
