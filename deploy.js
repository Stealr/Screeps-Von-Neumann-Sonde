const fs = require('fs');
const path = require('path');
require('dotenv').config();

const destDir = process.env.DEPLOY_LOCAL_PATH;
const bundleFile = path.join(__dirname, 'dist', 'main.js');
const destFile = path.join(destDir || '', 'main.js');

if (!destDir) {
    console.error('ERR: Variable DEPLOY_LOCAL_PATH not found in .env file');
    process.exit(1);
}

if (!fs.existsSync(destDir)) {
    console.error(`ERR: Destination folder does not exist: ${destDir}`);
    process.exit(1);
}

if (!fs.existsSync(bundleFile)) {
    console.error(`ERR: Bundle not found: ${bundleFile}. Run npm run build first.`);
    process.exit(1);
}

console.log(`Copying bundle ${bundleFile} → ${destFile}...`);
try {
    fs.copyFileSync(bundleFile, destFile);

    const mapFile = `${bundleFile}.map`;
    if (fs.existsSync(mapFile)) {
        fs.copyFileSync(mapFile, `${destFile}.map`);
    }

    console.log('Copy completed successfully.');
} catch (err) {
    console.error('Error during copying:', err);
    process.exit(1);
}
