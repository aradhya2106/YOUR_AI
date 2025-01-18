import Redis from 'ioredis';

// Initialize Redis using the connection URL
const redisClient = new Redis("redis://default:17lISeu5nxM5tZqDnG8dTEE4A7zxeU8h@redis-15884.c278.us-east-1-4.ec2.redns.redis-cloud.com:15884");

redisClient.on('connect', () => {
    console.log('Redis connected');
});

redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});

export default redisClient;
