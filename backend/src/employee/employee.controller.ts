import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type { EmployeeInput } from '../shared/contracts.js';
import { EmployeeService } from './employee.service.js';

@Controller()
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @MessagePattern('employee.login')
  login(@Payload() { email, password }: { email: string; password: string }) {
    return this.employeeService.login(email, password);
  }

  @MessagePattern('employee.findAll')
  findAll() {
    return this.employeeService.findAll();
  }

  @MessagePattern('employee.findOne')
  findOne(@Payload() id: number) {
    return this.employeeService.findOne(id);
  }

  @MessagePattern('employee.create')
  create(@Payload() input: EmployeeInput) {
    return this.employeeService.create(input);
  }

  @MessagePattern('employee.update')
  update(@Payload() { id, changes }: { id: number; changes: Partial<EmployeeInput> }) {
    return this.employeeService.update(id, changes);
  }

  @MessagePattern('employee.remove')
  async remove(@Payload() id: number) {
    await this.employeeService.remove(id);
    return { id };
  }
}
