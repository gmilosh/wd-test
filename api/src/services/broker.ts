import broker, {
    Channel, Connection, ConsumeMessage, Message, Replies,
} from 'amqplib';
// import config from 'config';

// const url: string = config.get('rabitmq.url');
const url = process.env.RABITMQ_URL || 'amqp://localhost';

// const exchange: string = config.get('rabitmq.exchange');
const exchange = 'video_processing';

let channel: Channel;
let connection: Connection;

export interface IEnvelope {
    message: string,
    key: string,
}

export async function connect() {
    // console.log(url)
    if (channel) return;
    connection = await broker.connect(url);
    if (!connection) return;
    channel = await connection.createChannel();

    channel.assertExchange(exchange, 'topic', { durable: false });
}

export async function disconnect() {
    await connection.close();
}

export async function publish(key: string, msg: unknown) {
    const payload: string = JSON.stringify(msg);
    // logger.info(`Message sent [${key}] with payload: ${msg}`)
    await connect();
    channel.publish(exchange, key, Buffer.from(payload));
}

export async function listen(key: string, callback: (a: IEnvelope) => void) {
    const aq: Replies.AssertQueue = await channel.assertQueue('', { exclusive: true });

    await channel.bindQueue(aq.queue, exchange, key);

    await channel.consume(aq.queue, (msg: ConsumeMessage | null) => {
        const str: string = msg ? msg.content.toString() : '';
        const envelope: IEnvelope = {
            key: msg?.fields.routingKey || '',
            message: str,
        };
        callback(envelope);
        channel.ack(msg as Message);
        // logger.info(`Message ${msg?.fields.routingKey} consumed with key [${key}]: ${str}`)
    }, { noAck: false });
}
