const path = require('path');
const rootDir = path.resolve(__dirname, '../');
const servicesDir = `${rootDir}/dist/modules/**/`;
const publicDir = `${rootDir}/../frontend/public`;

module.exports = {
    rootDir,
    servicesDir,
    publicDir,
}

