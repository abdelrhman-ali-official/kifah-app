// Production environment configuration
export const environment = {
  production: true,
  apiUrl: 'https://kifah.runasp.net/api', // Direct API calls in production
  statsApiUrl: 'https://data.techforpalestine.org', // Direct API calls in production
  kifah: {
    baseUrl: 'https://kifah.runasp.net/api/victims'
  },
  techForPalestine: {
    baseUrl: 'https://data.techforpalestine.org/api/v3'
  }
};