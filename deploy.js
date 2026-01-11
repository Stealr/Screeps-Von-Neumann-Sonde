const fs = require('fs');
const path = require('path');
require('dotenv').config();

const destDir = process.env.DEPLOY_LOCAL_PATH;
const sourceDir = path.join(__dirname, 'dist');

if (!destDir) {
    console.error('ERR: Variable DEPLOY_LOCAL_PATH not found in .env file');
    process.exit(1);
}

if (!fs.existsSync(destDir)) {
    console.error(`ERR: Destination folder does not exist: ${destDir}`);
    process.exit(1);
}

console.log(`Copying files from ${sourceDir} to ${destDir}...`);
try {
    fs.cpSync(sourceDir, destDir, {
        recursive: true,
        force: true
    });
    console.log('Copy completed successfully.');
} catch (err) {
    console.error('Error during copying:', err);
    process.exit(1);
}