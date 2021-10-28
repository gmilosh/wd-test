module.exports = {
  apps: [
    {
      name: 'wd-api',
      script: './api/build/api.js',
      env: {
        NODE_ENV: "production",
      }
    },
    {
      name: 'wd-scan',
      script: './api/build/video.service.js',
      env: {
        SERVICE_NAME: "scan",
      }
    },
    {
      name: 'wd-edit',
      script: './api/build/video.service.js',
      env: {
        SERVICE_NAME: "edit",
      }
    },
    {
      name: 'wd-prepare',
      script: './api/build/video.service.js',
      env: {
        SERVICE_NAME: "prepare",
      }
    },
    {
      name: 'wd-finish',
      script: './api/build/video.service.js',
      env: {
        SERVICE_NAME: "finish",
      }
    },
    {
      name: 'wd-frontend',
      script: 'serve',
      env: {
        PM2_SERVE_PATH: './frontend/build',
        PM2_SERVE_PORT: 3000,
        PM2_SERVE_SPA: 'true',
        PM2_SERVE_HOMEPAGE: '/index.html',
      },
    }
  ],

  // deploy : {
  //   production : {
  //     user : 'SSH_USERNAME',
  //     host : 'SSH_HOSTMACHINE',
  //     ref  : 'origin/master',
  //     repo : 'GIT_REPOSITORY',
  //     path : 'DESTINATION_PATH',
  //     'pre-deploy-local': '',
  //     'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
  //     'pre-setup': ''
  //   }
  // }
};
