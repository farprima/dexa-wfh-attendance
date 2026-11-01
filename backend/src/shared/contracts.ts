import { RpcException } from '@nestjs/microservices';

// Message patterns and payloads shared by the gateway and the services.
export const EMPLOYEE_SERVICE = 'EMPLOYEE_SERVICE';
export const ATTENDANCE_SERVICE = 'ATTENDANCE_SERVICE';

export enum Role {
  Admin = 'ADMIN',
  Employee = 'EMPLOYEE',
}

export interface EmployeeInput {
  name: string;
  email: string;
  position: string;
  role: Role;
  password: string;
}

export interface AttendanceFilter {
  employeeId?: number;
  from?: string;
  to?: string;
}

// Services fail with an HTTP status code so the gateway can pass it on.
export const rpcError = (statusCode: number, message: string) =>
  new RpcException({ statusCode, message });
