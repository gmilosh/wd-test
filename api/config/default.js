module.exports = {
    port: 3001,
    rabitmq: {
        url: 'amqp://localhost',
        exchange: 'video_processing',
    },
    websocket: {
        port: 8889,
    },
    services: [
        'scan',
        'edit',
        'prepare',
        'finish',
    ],
};
