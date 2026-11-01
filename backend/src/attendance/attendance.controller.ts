import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type { AttendanceFilter } from '../shared/contracts.js';
import { AttendanceService } from './attendance.service.js';

@Controller()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @MessagePattern('attendance.checkIn')
  checkIn(@Payload() { employeeId, photo }: { employeeId: number; photo: string }) {
    return this.attendanceService.checkIn(employeeId, photo);
  }

  @MessagePattern('attendance.findAll')
  findAll(@Payload() filter: AttendanceFilter) {
    return this.attendanceService.findAll(filter);
  }
}
