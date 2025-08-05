#!/usr/bin/env node

const { execSync } = require('child_process');

async function build() {
  try {
    console.log('🏗️  Building Remix app...');
    execSync('npx remix vite:build', { stdio: 'inherit' });
    
    console.log('✅ Build completed successfully!');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

build(); 