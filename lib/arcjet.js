import arcjet, { tokenBucket } from '@arcjet/next';

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ['userId'], // Track based on clerk user id
  rules: [
    tokenBucket({
      mode: 'LIVE',
      refillRate: 10,
      interval: 3600, // every hour
      capacity: 10, // can make only 10 requests
    }),
  ],
});

export default aj;
