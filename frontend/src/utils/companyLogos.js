// Company logo mapping utility
export const getCompanyLogoSrc = (company) => {
  let name = '';

  if (typeof company === 'string') {
    name = company;
  } else if (company?.name) {
    name = company.name;
  }

  if (!name) return '/logos/default-logo.svg';

  // Create mapping for available company logos
  const logoMapping = {
    'google': '/logos/google-1-1.svg',
    'meta': '/logos/meta-3.svg',
    'facebook': '/logos/facebook-3-2.svg',
    'tesla': '/logos/tesla-9.svg',
    'cognizant': '/logos/cognizants-logo-1.svg',
    'tcs': '/logos/tata-consultancy-services-1.svg',
    'tata consultancy services': '/logos/tata-consultancy-services-1.svg',
    'nec': '/logos/nec-5.svg',
    'enel group': '/logos/enel-group-1.svg',
    'enel': '/logos/enel-group-1.svg',
    'snn': '/logos/snn.svg',
    'amazon': '/logos/amazon-dark.svg',
    'microsoft': '/logos/microsoft-6.svg',
    'nvidia': '/logos/nvidia.svg',
    'sencor': '/logos/sencor.svg',
    'walmart': '/logos/walmart-2.svg',
    'apple': '/logos/apple.svg',
    'aditya birla group': '/logos/aditya-birla-group.jpg',
    'aditya birla': '/logos/aditya-birla-group.jpg',
    'birla group': '/logos/aditya-birla-group.jpg',
    'coca-cola': '/logos/coca-cola-2021.svg',
    'coca cola': '/logos/coca-cola-2021.svg',
    'coke': '/logos/coca-cola-2021.svg',
    'telegram': '/logos/telegram.svg'
  };

  const normalizedName = name.toLowerCase().trim();
  
  // Check direct mapping first
  if (logoMapping[normalizedName]) {
    return logoMapping[normalizedName];
  }

  // Check if company name contains any of the mapped names
  for (const [key, logoPath] of Object.entries(logoMapping)) {
    if (normalizedName.includes(key)) {
      return logoPath;
    }
  }

  // Fallback to default logo if no match found
  return '/logos/default-logo.svg';
};

// Export the logo mapping for reference if needed
export const companyLogoMapping = {
  'google': '/logos/google-1-1.svg',
  'meta': '/logos/meta-3.svg',
  'facebook': '/logos/facebook-3-2.svg',
  'tesla': '/logos/tesla-9.svg',
  'cognizant': '/logos/cognizants-logo-1.svg',
  'tcs': '/logos/tata-consultancy-services-1.svg',
  'tata consultancy services': '/logos/tata-consultancy-services-1.svg',
  'nec': '/logos/nec-5.svg',
  'enel group': '/logos/enel-group-1.svg',
  'enel': '/logos/enel-group-1.svg',
  'snn': '/logos/snn.svg',
  'amazon': '/logos/amazon-dark.svg',
  'microsoft': '/logos/microsoft-6.svg',
  'nvidia': '/logos/nvidia.svg',
  'sencor': '/logos/sencor.svg',
  'walmart': '/logos/walmart-2.svg',
  'apple': '/logos/apple.svg',
  'aditya birla group': '/logos/aditya-birla-group.jpg',
  'aditya birla': '/logos/aditya-birla-group.jpg',
  'birla group': '/logos/aditya-birla-group.jpg',
  'coca-cola': '/logos/coca-cola-2021.svg',
  'coca cola': '/logos/coca-cola-2021.svg',
  'coke': '/logos/coca-cola-2021.svg',
  'telegram': '/logos/telegram.svg'
};
