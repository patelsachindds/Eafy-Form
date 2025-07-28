#!/usr/bin/env node

const { execSync } = require('child_process');

async function build() {
  try {
    console.log('🔧 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    // Only run migrations if DATABASE_URL is available
    if (process.env.DATABASE_URL) {
      console.log('🗄️  Running database migrations...');
      try {
        execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      } catch (error) {
        console.warn('⚠️  Database migration failed, continuing with build...');
        console.warn('   This is normal if the database is not accessible during build time.');
      }
    } else {
      console.log('⚠️  DATABASE_URL not found, skipping migrations...');
    }
    
    console.log('🏗️  Building Remix app...');
    execSync('npx remix vite:build', { stdio: 'inherit' });
    
    console.log('✅ Build completed successfully!');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

build(); 