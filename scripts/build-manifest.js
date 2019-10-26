const Fs = require('fs');
const Path = require('path');
const MANIFEST_FILE = Path.join(__dirname, '../build/manifest.json');
const ASSET_FILE = Path.join(__dirname, '../build/asset-manifest.json');

// already created manifest, but missing content scripts
const manifestFile = JSON.parse(Fs.readFileSync(MANIFEST_FILE));
// file containing newly build and hashed *.js / *.css files
const assetManifestFile = JSON.parse(Fs.readFileSync(ASSET_FILE));

const builtFiles = Object.values(assetManifestFile.files);

const builtCssFiles = builtFiles.filter((file) => file.endsWith('.css'));
const builtJsFiles = builtFiles.filter((file) =>
    file.endsWith('.js') && !file.startsWith('/service-worker')
);

manifestFile['content_scripts'][0].css = builtCssFiles;
manifestFile['content_scripts'][0].js = builtJsFiles;

Fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifestFile));
