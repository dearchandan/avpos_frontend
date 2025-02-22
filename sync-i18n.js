const fs = require('fs');
const glob = require('glob');
const _ = require('lodash');

const enFilePath = 'src/lang/en.json';
const arFilePath = 'src/lang/ar.json';

// Read JSON files
const enContent = JSON.parse(fs.readFileSync(enFilePath, 'utf-8'));
const arContent = JSON.parse(fs.readFileSync(arFilePath, 'utf-8'));

// Function to extract i18n keys from a string
const extractKeys = (str) => {
  const regex = /\$t\(['"`]([^'"`]+)['"`]\)/g;
  let matches, keys = [];
  while ((matches = regex.exec(str)) !== null) {
    keys.push(matches[1]);
  }
  return keys;
};

// Scan project files for i18n keys
const files = glob.sync('src/**/*.vue'); // Adjust this pattern to match your project structure
let allKeys = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const keys = extractKeys(content);
  allKeys = allKeys.concat(keys);
});

allKeys = _.uniq(allKeys);

// Find missing keys in translations
const missingInAr = _.difference(allKeys, _.keys(arContent));
const missingInEn = _.difference(allKeys, _.keys(enContent));

// Add missing keys to translations with empty string
missingInAr.forEach(key => {
  arContent[key] = '';
});

missingInEn.forEach(key => {
  enContent[key] = '';
});

// Write updated content back to files
fs.writeFileSync(enFilePath, JSON.stringify(enContent, null, 2), 'utf-8');
fs.writeFileSync(arFilePath, JSON.stringify(arContent, null, 2), 'utf-8');

console.log('Missing keys added successfully!');
