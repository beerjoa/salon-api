import { registerAs } from '@nestjs/config';

export const commonConfig = registerAs('common', () => ({
  nodeEnv: process.env.NODE_ENV,
  appName: process.env.APP_NAME,
  appUrl: process.env.APP_URL,
  host: process.env.HOST,
  port: parseInt(process.env.PORT || '3000', 10),
}));
