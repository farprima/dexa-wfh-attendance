import { NestFactory } from '@nestjs/core';
import { type MicroserviceOptions, Transport } from '@nestjs/microservices';
import { config } from '../shared/config.js';
import { EmployeeModule } from './employee.module.js';

const app = await NestFactory.createMicroservice<MicroserviceOptions>(EmployeeModule, {
  transport: Transport.TCP,
  options: config.employeeService,
});
await app.listen();
