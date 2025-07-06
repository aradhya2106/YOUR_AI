import Redis from 'ioredis';

// Initialize Redis using the connection URL
const redisClient = new Redis("redis-15461.c305.ap-south-1-1.ec2.redns.redis-cloud.com:15461");

redisClient.on('connect', () => {
    console.log('Redis connected');
});

redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});

export default redisClient;
