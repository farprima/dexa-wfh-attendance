import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { config } from '../shared/config.js';
import { ATTENDANCE_SERVICE, EMPLOYEE_SERVICE } from '../shared/contracts.js';
import { AttendancesController } from './attendances.controller.js';
import { AuthController } from './auth.controller.js';
import { EmployeesController } from './employees.controller.js';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: config.jwtSecret,
      signOptions: { expiresIn: '8h' },
    }),
    ClientsModule.register([
      { name: EMPLOYEE_SERVICE, transport: Transport.TCP, options: config.employeeService },
      { name: ATTENDANCE_SERVICE, transport: Transport.TCP, options: config.attendanceService },
    ]),
  ],
  controllers: [AuthController, EmployeesController, AttendancesController],
})
export class GatewayModule {}
