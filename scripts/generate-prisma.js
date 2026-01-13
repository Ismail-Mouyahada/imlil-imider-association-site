const { execSync } = require('child_process');
const path = require('path');

console.log('Generating Prisma client...');

try {
  execSync('npx prisma generate', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  console.log('✅ Prisma client generated successfully!');
} catch (error) {
  console.error('❌ Error generating Prisma client:', error.message);
  process.exit(1);
}
