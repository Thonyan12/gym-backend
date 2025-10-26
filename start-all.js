const { spawn } = require('child_process');
const path = require('path');

const services = [
  { name: 'gateway', file: path.join(__dirname, 'gateway', 'index.js') },
  { name: 'auth-service', file: path.join(__dirname, 'services', 'auth-service', 'index.js') },
  { name: 'members-service', file: path.join(__dirname, 'services', 'members-service', 'index.js') },
  { name: 'trainers-service', file: path.join(__dirname, 'services', 'trainers-service', 'index.js') },
  { name: 'billing-service', file: path.join(__dirname, 'services', 'billing-service', 'index.js') },
  { name: 'products-service', file: path.join(__dirname, 'services', 'products-service', 'index.js') },
  { name: 'notifications-service', file: path.join(__dirname, 'services', 'notifications-service', 'index.js') }
];

const children = [];

services.forEach(svc => {
  console.log(`Starting ${svc.name} -> node ${svc.file}`);
  const child = spawn('node', [svc.file], { stdio: 'inherit' });
  children.push(child);

  child.on('exit', (code, signal) => {
    console.log(`${svc.name} exited with code ${code} signal ${signal}`);
  });
});

function shutdown() {
  console.log('Shutting down all child processes...');
  children.forEach(c => {
    try { c.kill(); } catch (e) {}
  });
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
