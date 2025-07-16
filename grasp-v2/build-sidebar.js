#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔥 Building Grasp V2 - Vue.js + TypeScript...');

// Chemins
const bundleJsPath = path.join(__dirname, 'frontend/dist/bundle.js');
const bundleCssPath = path.join(__dirname, 'frontend/dist/bundle.css');
const sidebarTemplatePath = path.join(__dirname, 'gas-files/sidebar.html');
const sidebarOutputPath = path.join(__dirname, 'gas-files/sidebar.html');

// Vérifier que les bundles existent
if (!fs.existsSync(bundleJsPath)) {
  console.error('❌ Bundle JS non trouvé. Lancez d abord: npm run build');
  process.exit(1);
}

// Lire les fichiers
const bundleJs = fs.readFileSync(bundleJsPath, 'utf8');
const bundleCss = fs.existsSync(bundleCssPath) ? fs.readFileSync(bundleCssPath, 'utf8') : '';
let sidebarHtml = fs.readFileSync(sidebarTemplatePath, 'utf8');

// Injecter le CSS dans le head si présent
if (bundleCss) {
  const cssTag = `<style>${bundleCss}</style>`;
  sidebarHtml = sidebarHtml.replace('</head>', `  ${cssTag}\n</head>`);
}

// Injecter le JavaScript
sidebarHtml = sidebarHtml.replace(
  '<script id="vue-bundle">',
  `<script id="vue-bundle">\n${bundleJs}\n`
);

// Écrire le fichier final
fs.writeFileSync(sidebarOutputPath, sidebarHtml);

console.log('✅ Sidebar généré avec succès!');
console.log('📁 Fichier: gas-files/sidebar.html');
console.log('🚀 Prêt pour Google Apps Script!');
