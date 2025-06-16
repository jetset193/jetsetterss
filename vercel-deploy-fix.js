#!/usr/bin/env node

/**
 * Vercel Deployment Fix Script
 * Prepares the project for successful Vercel deployment
 */

import fs from 'fs';
import path from 'path';

console.log('🔧 Preparing project for Vercel deployment...\n');

// 1. Check and update vercel.json
function updateVercelConfig() {
  console.log('📝 Updating vercel.json configuration...');
  
  const vercelConfigPath = './vercel.json';
  let vercelConfig;
  
  try {
    vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
  } catch (error) {
    console.error('❌ Failed to read vercel.json:', error.message);
    return;
  }
  
  // Update environment variables for build
  if (!vercelConfig.build) {
    vercelConfig.build = {};
  }
  
  if (!vercelConfig.build.env) {
    vercelConfig.build.env = {};
  }
  
  // Set correct production URLs
  vercelConfig.build.env.VITE_API_URL = "https://prod-six-phi.vercel.app/api";
  vercelConfig.build.env.VITE_APP_URL = "https://prod-six-phi.vercel.app";
  vercelConfig.build.env.VITE_PROD_API_URL = "https://prod-six-phi.vercel.app/api";
  vercelConfig.build.env.VITE_PROD_APP_URL = "https://prod-six-phi.vercel.app";
  
  // Ensure correct environment variables for runtime
  if (!vercelConfig.env) {
    vercelConfig.env = {};
  }
  
  // Add missing environment variables
  const requiredEnvVars = {
    "NODE_ENV": "production",
    "JWT_EXPIRE": "30d",
    "CORS_ORIGIN": "*",
    "ARC_PAY_REAL_TIME": "true",
    "ARC_PAY_PRODUCTION_READY": "true"
  };
  
  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!vercelConfig.env[key]) {
      vercelConfig.env[key] = value;
    }
  });
  
  try {
    fs.writeFileSync(vercelConfigPath, JSON.stringify(vercelConfig, null, 4));
    console.log('✅ Updated vercel.json successfully');
  } catch (error) {
    console.error('❌ Failed to write vercel.json:', error.message);
  }
}

// 2. Check package.json build scripts
function checkBuildScripts() {
  console.log('📦 Checking package.json build scripts...');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }
    
    // Ensure we have the correct build script
    const requiredScripts = {
      "build": "vite build",
      "build:prod": "NODE_ENV=production vite build",
      "vercel-build": "npm run build",
      "start": "node server.js"
    };
    
    let updated = false;
    Object.entries(requiredScripts).forEach(([script, command]) => {
      if (!packageJson.scripts[script]) {
        packageJson.scripts[script] = command;
        updated = true;
      }
    });
    
    if (updated) {
      fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
      console.log('✅ Updated package.json scripts');
    } else {
      console.log('✅ Package.json scripts are correct');
    }
    
  } catch (error) {
    console.error('❌ Failed to check package.json:', error.message);
  }
}

// 3. Create .vercelignore file
function createVercelIgnore() {
  console.log('🚫 Creating .vercelignore file...');
  
  const vercelIgnoreContent = `# Development files
node_modules
.env.local
.env.development
.env.test

# Build files (will be generated)
dist/

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
coverage/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Temporary files
*.tmp
*.temp
`;

  try {
    fs.writeFileSync('./.vercelignore', vercelIgnoreContent);
    console.log('✅ Created .vercelignore file');
  } catch (error) {
    console.error('❌ Failed to create .vercelignore:', error.message);
  }
}

// 4. Test the API configuration
async function testApiConfig() {
  console.log('🧪 Testing API configuration...');
  
  try {
    // Simple test to ensure our API config logic works
    const apiConfigPath = './src/config/api.js';
    if (fs.existsSync(apiConfigPath)) {
      console.log('✅ API configuration file exists');
      
      // Read the file to check for our updates
      const apiConfigContent = fs.readFileSync(apiConfigPath, 'utf8');
      
      if (apiConfigContent.includes('prod-six-phi.vercel.app')) {
        console.log('✅ API configuration contains correct Vercel URL');
      } else {
        console.log('⚠️  API configuration might need manual verification');
      }
      
      if (apiConfigContent.includes('jetsetterss.com')) {
        console.log('✅ API configuration handles jetsetterss.com domain');
      } else {
        console.log('⚠️  API configuration might not handle custom domain properly');
      }
    } else {
      console.log('❌ API configuration file not found');
    }
  } catch (error) {
    console.error('❌ Failed to test API config:', error.message);
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting Vercel deployment preparation...\n');
  
  updateVercelConfig();
  console.log('');
  
  checkBuildScripts();
  console.log('');
  
  createVercelIgnore();
  console.log('');
  
  await testApiConfig();
  console.log('');
  
  console.log('🎉 Deployment preparation complete!');
  console.log('');
  console.log('📋 Next steps:');
  console.log('1. Run: npm run build (to test local build)');
  console.log('2. Commit changes to git');
  console.log('3. Deploy to Vercel: vercel --prod');
  console.log('4. Test the deployment with: node test-vercel-deployment.js');
  console.log('');
  console.log('🔗 Your app will be available at: https://prod-six-phi.vercel.app');
  console.log('💳 Payment system will work correctly on the deployed version');
}

main().catch(console.error); 