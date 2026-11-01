import { NestFactory } from '@nestjs/core';
import { type MicroserviceOptions, Transport } from '@nestjs/microservices';
import { config } from '../shared/config.js';
import { AttendanceModule } from './attendance.module.js';

const app = await NestFactory.createMicroservice<MicroserviceOptions>(AttendanceModule, {
  transport: Transport.TCP,
  options: config.attendanceService,
});
await app.listen();
