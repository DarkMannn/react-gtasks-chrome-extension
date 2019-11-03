require('dotenv').config();
const Fs = require('fs');
const Path = require('path');
const MANIFEST_FILE = Path.join(__dirname, '../build/manifest.json');

// already created manifest, but missing secrets
const manifestFile = JSON.parse(Fs.readFileSync(MANIFEST_FILE));

manifestFile.key = process.env.KEY;
manifestFile.oauth2.client_id = process.env.CLIENT_ID;

Fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifestFile));
