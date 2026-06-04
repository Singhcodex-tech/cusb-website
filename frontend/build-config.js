const fs = require('fs');
const path = require('path');

const apiBase = process.env.API_BASE_URL || 'https://cusb-website.onrender.com/api';
const uploadBase = process.env.UPLOAD_BASE_URL || 'https://cusb-website.onrender.com';

const configContent = `window.APP_CONFIG = {
  apiBase: '${apiBase}',
  uploadBase: '${uploadBase}'
};
`;

fs.writeFileSync(path.join(__dirname, 'config.js'), configContent);
console.log('✓ Config built:', { apiBase, uploadBase });
