const SchemaTemplates = {
  article: (data) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.headline || "Sample Headline",
    description: data.description || "Sample description",
    author: { "@type": "Person", name: data.author || "John Doe" },
    datePublished: data.datePublished || "2025-01-01"
  }),
  breadcrumb: (items) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(i => ({
      "@type": "ListItem",
      position: i.position,
      name: i.name || "Sample",
      item: i.item || "https://example.com"
    }))
  }),
  faq: (items) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(f => ({
      "@type": "Question",
      name: f.question || "Sample Question",
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer || "Sample Answer"
      }
    }))
  }),
  localBusiness: (data) => ({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: data.name || "Sample Business",
    address: data.address || "123 Sample Street",
    telephone: data.phone || "+1-000-000-0000",
    url: data.website || "https://example.com"
  }),
  organization: (data) => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: data.name || "Sample Organization",
    url: data.url || "https://example.com",
    logo: data.logo || "https://example.com/logo.png"
  }),
  profile: (data) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name: data.name || "John Doe",
    jobTitle: data.jobTitle || "Developer",
    image: data.image || "https://example.com/profile.jpg"
  })
};
