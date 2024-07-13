import Redis from 'ioredis';

// Replace with your Redis server configuration
const redis = new Redis({
  host: 'your-redis-server-host',
  port: 6379, // default Redis port
//   password: '', // replace with your password if set
});

export {
    redis
}