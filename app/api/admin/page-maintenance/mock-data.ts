// Mock data for page maintenance when database is not available
export const mockPageMaintenanceData = [
  {
    id: 1,
    page_path: '/',
    page_name: 'Homepage',
    is_maintenance: false,
    maintenance_message: 'Our homepage is currently under maintenance. We\'re working to improve your experience.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    page_path: '/top-casinos',
    page_name: 'Best Casinos',
    is_maintenance: false,
    maintenance_message: 'Our Best Casinos page is currently under maintenance. Please check back soon for the latest casino recommendations.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    page_path: '/casinos',
    page_name: 'All Casinos',
    is_maintenance: false,
    maintenance_message: 'Our Casinos directory is currently under maintenance. We\'re updating our casino database.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    page_path: '/reviews',
    page_name: 'Reviews',
    is_maintenance: false,
    maintenance_message: 'Our Reviews section is currently under maintenance. We\'re working on bringing you the latest casino reviews.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 5,
    page_path: '/list-report',
    page_name: 'List Report',
    is_maintenance: false,
    maintenance_message: 'Our List Report feature is currently under maintenance. Please try again later.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 6,
    page_path: '/forum',
    page_name: 'Forum',
    is_maintenance: false,
    maintenance_message: 'Our Forum is currently under maintenance. We\'re improving the community experience.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 7,
    page_path: '/guide',
    page_name: 'Guide',
    is_maintenance: false,
    maintenance_message: 'Our Guide section is currently under maintenance. We\'re updating our casino guides.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 8,
    page_path: '/news',
    page_name: 'News',
    is_maintenance: false,
    maintenance_message: 'Our News section is currently under maintenance. We\'re working on bringing you the latest casino news.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// In-memory storage for development/testing
let maintenanceData = [...mockPageMaintenanceData];
