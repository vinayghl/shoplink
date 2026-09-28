import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const distDir = path.join(rootDir, 'dist');
const docsDir = path.join(rootDir, 'docs');

try {
  if (fs.existsSync(distDir)) {
    // 1. Create .nojekyll in dist
    fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

    // 2. Create 404.html in dist (duplicate of index.html for SPA routing on GitHub Pages)
    const distIndex = path.join(distDir, 'index.html');
    if (fs.existsSync(distIndex)) {
      fs.copyFileSync(distIndex, path.join(distDir, '404.html'));
    }

    // 3. Mirror everything into docs/ so users who choose "/docs" in GitHub Pages settings get a working app
    fs.rmSync(docsDir, { recursive: true, force: true });
    fs.cpSync(distDir, docsDir, { recursive: true });

    console.log('✓ Successfully generated dist/ and docs/ with .nojekyll and 404.html for GitHub Pages deployment.');
  }
} catch (err) {
  console.warn('Notice during copy-build:', err.message);
}
