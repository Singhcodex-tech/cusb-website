const fs = require('fs');
const path = require('path');

const apiBase = process.env.API_BASE_URL || 'http://localhost:5000/api';
const uploadBase = process.env.UPLOAD_BASE_URL || 'http://localhost:5000';

const configContent = `window.APP_CONFIG = {
  apiBase: '${apiBase}',
  uploadBase: '${uploadBase}'
};
`;

fs.writeFileSync(path.join(__dirname, 'config.js'), configContent);
console.log('✓ Config built:', { apiBase, uploadBase });
