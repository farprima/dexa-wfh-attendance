import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { config } from '../shared/config.js';
import { UPLOADS_DIR } from './attendances.controller.js';
import { GatewayModule } from './gateway.module.js';

if (!config.jwtSecret) throw new Error('JWT_SECRET is not set, copy .env.example to .env');

const app = await NestFactory.create<NestExpressApplication>(GatewayModule);
app.setGlobalPrefix('api');
app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
app.useStaticAssets(UPLOADS_DIR, { prefix: '/uploads/' });
await app.listen(config.gatewayPort);
