#!/usr/bin/env node

// Load environment variables from .env file
import dotenv from "dotenv";
dotenv.config();
import { spawn } from "child_process";

// Get the ngrok domain from environment variable
const ngrokDomain = process.env.NGROK_PUBLIC_DOMAIN;

// Check if the environment variable is set
if (!ngrokDomain) {
  console.error('❌ Error: NGROK_PUBLIC_DOMAIN environment variable is not set');
  console.log('💡 Please add NGROK_PUBLIC_DOMAIN=your-domain.ngrok-free.app to your .env file');
  process.exit(1);
}

// Start ngrok with the domain from environment variable
console.log(`🚀 Starting ngrok with domain: ${ngrokDomain}`);
const ngrok = spawn('ngrok', ['http', `--url=${ngrokDomain}`, '3000'], {
  stdio: 'inherit', // This allows us to see ngrok's output
  shell: true
});

// Handle process termination
ngrok.on('close', (code) => {
  console.log(`\n🛑 Ngrok process exited with code ${code}`);
});

// Handle errors
ngrok.on('error', (error) => {
  console.error('❌ Failed to start ngrok:', error.message);
  process.exit(1);
});

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping ngrok...');
  ngrok.kill('SIGINT');
}); 