import Redis from 'ioredis';

// Replace with your Redis server configuration
const redis = new Redis(
  
  Number(process.env["REDIS_PORT"]),
  process.env["REDIS_HOST"]!,
  {
    username: process.env["REDIS_USERNAME"],
    password: process.env["REDIS_PASSWORD"]
  }
);

export {
    redis
}