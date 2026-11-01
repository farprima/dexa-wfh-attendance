import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '../shared/config.js';
import { AttendanceController } from './attendance.controller.js';
import { Attendance } from './attendance.entity.js';
import { AttendanceService } from './attendance.service.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...config.database,
      database: 'dexa_attendance',
      entities: [Attendance],
    }),
    TypeOrmModule.forFeature([Attendance]),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}
