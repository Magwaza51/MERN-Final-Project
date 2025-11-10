module.exports = {
  apps: [
    {
      name: 'mern-app',
      script: 'server.js',
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'development',
        PORT: 5000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
        // Add other production env vars here or set them in the VPS environment
      }
    }
  ]
};
