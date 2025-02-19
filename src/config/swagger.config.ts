import { registerAs } from '@nestjs/config';

const _FormattingServerDescription = () => {
  const nodeEnv = process.env.NODE_ENV ?? 'development';
  const firstLetter = nodeEnv.charAt(0).toUpperCase();
  const restLetter = nodeEnv.slice(1).toLowerCase();

  return `${firstLetter}${restLetter}`;
};

export const swaggerConfig = registerAs('swagger', () => ({
  server: {
    url: process.env.APP_URL,
    description: _FormattingServerDescription(),
  },
  title: `${process.env.APP_NAME} API`,
  description: `
  ---
  <br>
  **Welcome to the Salon API**
  

  <br>
  
  ---
  `,
  version: '0.1.0',
  contact: {
    name: 'Beerjoa',
    url: 'https://blog.beerjoa.dev/',
    email: 'hello@beerjoa.dev',
  },
  license: {
    name: 'MIT License',
  },
}));
