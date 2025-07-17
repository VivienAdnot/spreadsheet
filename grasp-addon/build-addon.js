const fs = require('fs');
const path = require('path');

console.log('🔧 Building Grasp Add-on...');

// Chemins des fichiers
const bundleJsPath = path.join(__dirname, 'dist', 'bundle.js');
const bundleCssPath = path.join(__dirname, 'dist', 'bundle.css');
const iframeTemplatePath = path.join(__dirname, 'public', 'iframe.html');
const outputPath = path.join(__dirname, 'public', 'iframe.html');

try {
  // Vérifier que les bundles existent
  if (!fs.existsSync(bundleJsPath)) {
    throw new Error('Bundle JS non trouvé. Exécutez d\'abord npm run build');
  }

  // Lire les fichiers
  const bundleJs = fs.readFileSync(bundleJsPath, 'utf8');
  const bundleCss = fs.existsSync(bundleCssPath) ? fs.readFileSync(bundleCssPath, 'utf8') : '';
  let iframeHtml = fs.readFileSync(iframeTemplatePath, 'utf8');

  // Injecter le CSS dans le HTML
  if (bundleCss) {
    const cssInjection = `<style>
/* Grasp Add-on Styles */
${bundleCss}
</style>`;
    iframeHtml = iframeHtml.replace('</head>', `${cssInjection}\n</head>`);
  }

  // Injecter le JS dans le HTML
  const jsInjection = `<script>
/* Grasp Add-on Bundle */
${bundleJs}
</script>`;
  iframeHtml = iframeHtml.replace('<!-- Le bundle sera injecté ici -->', jsInjection);

  // Écrire le fichier final
  fs.writeFileSync(outputPath, iframeHtml);

  // Statistiques
  const stats = {
    bundleJs: `${Math.round(bundleJs.length / 1024)} KB`,
    bundleCss: `${Math.round(bundleCss.length / 1024)} KB`,
    finalHtml: `${Math.round(iframeHtml.length / 1024)} KB`
  };

  console.log('✅ Add-on construit avec succès!');
  console.log('📊 Statistiques:');
  console.log(`   - Bundle JS: ${stats.bundleJs}`);
  console.log(`   - Bundle CSS: ${stats.bundleCss}`);
  console.log(`   - HTML final: ${stats.finalHtml}`);
  console.log(`📁 Fichier de sortie: ${outputPath}`);
  console.log('🚀 Prêt pour le déploiement avec clasp!');

} catch (error) {
  console.error('❌ Erreur lors du build:', error.message);
  process.exit(1);
}
