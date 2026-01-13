const fs = require('fs');
const path = require('path');

// Vérifier que toutes les images sont dans le dossier public
const publicDir = path.join(__dirname, 'public', 'imider');
const srcDir = path.join(__dirname, 'src', 'data', 'imider');

console.log('🔍 Vérification des images...\n');

// Lire les fichiers dans src/data/imider
const srcFiles = fs.readdirSync(srcDir).filter(file => file.endsWith('.jpg'));
console.log(`📁 Images dans src/data/imider: ${srcFiles.length}`);

// Lire les fichiers dans public/imider
const publicFiles = fs.readdirSync(publicDir).filter(file => file.endsWith('.jpg'));
console.log(`📁 Images dans public/imider: ${publicFiles.length}`);

// Vérifier que tous les fichiers sont copiés
const missingFiles = srcFiles.filter(file => !publicFiles.includes(file));
const extraFiles = publicFiles.filter(file => !srcFiles.includes(file));

if (missingFiles.length === 0 && extraFiles.length === 0) {
  console.log('✅ Toutes les images sont correctement copiées!');
} else {
  if (missingFiles.length > 0) {
    console.log('❌ Images manquantes dans public/imider:');
    missingFiles.forEach(file => console.log(`   - ${file}`));
  }
  if (extraFiles.length > 0) {
    console.log('⚠️  Images supplémentaires dans public/imider:');
    extraFiles.forEach(file => console.log(`   - ${file}`));
  }
}

// Tester quelques URLs
console.log('\n🔗 Test des URLs:');
const testFiles = srcFiles.slice(0, 3);
testFiles.forEach(file => {
  const url = `/imider/${file}`;
  console.log(`   ${file} -> ${url}`);
});

console.log('\n✨ Vérification terminée!');
