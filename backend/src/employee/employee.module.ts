import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '../shared/config.js';
import { EmployeeController } from './employee.controller.js';
import { Employee } from './employee.entity.js';
import { EmployeeService } from './employee.service.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...config.database, database: 'dexa_employee', entities: [Employee] }),
    TypeOrmModule.forFeature([Employee]),
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
