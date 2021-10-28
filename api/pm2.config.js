module.exports = {
    apps: [
        {
            name: 'wd-api',
            script: './build/api.js',
            env: {
                NODE_ENV: 'production',
            },
        },
        {
            name: 'wd-scan',
            script: './build/video.service.js',
            env: {
                SERVICE_NAME: 'scan',
            },
        },
        {
            name: 'wd-edit',
            script: './build/video.service.js',
            env: {
                SERVICE_NAME: 'edit',
            },
        },
        {
            name: 'wd-prepare',
            script: './build/video.service.js',
            env: {
                SERVICE_NAME: 'prepare',
            },
        },
        {
            name: 'wd-finish',
            script: './build/video.service.js',
            env: {
                SERVICE_NAME: 'finish',
            },
        },
    ],
};
