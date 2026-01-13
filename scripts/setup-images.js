#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🖼️  Configuration des images d\'Imider...\n');

const srcDir = path.join(__dirname, '..', 'src', 'data', 'imider');
const publicDir = path.join(__dirname, '..', 'public', 'imider');

// Créer le dossier public/imider s'il n'existe pas
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log('📁 Dossier public/imider créé');
}

// Vérifier que le dossier source existe
if (!fs.existsSync(srcDir)) {
  console.error('❌ Dossier src/data/imider introuvable!');
  process.exit(1);
}

// Lire les fichiers source
const srcFiles = fs.readdirSync(srcDir).filter(file => file.endsWith('.jpg'));
console.log(`📁 ${srcFiles.length} images trouvées dans src/data/imider`);

// Copier les images
let copiedCount = 0;
srcFiles.forEach(file => {
  const srcPath = path.join(srcDir, file);
  const destPath = path.join(publicDir, file);
  
  try {
    fs.copyFileSync(srcPath, destPath);
    copiedCount++;
  } catch (error) {
    console.error(`❌ Erreur lors de la copie de ${file}:`, error.message);
  }
});

console.log(`✅ ${copiedCount} images copiées vers public/imider`);

// Vérifier la copie
const publicFiles = fs.readdirSync(publicDir).filter(file => file.endsWith('.jpg'));
if (publicFiles.length === srcFiles.length) {
  console.log('🎉 Toutes les images sont correctement configurées!');
} else {
  console.error(`❌ Erreur: ${srcFiles.length} images source mais ${publicFiles.length} images dans public`);
  process.exit(1);
}

console.log('\n✨ Configuration terminée!');
