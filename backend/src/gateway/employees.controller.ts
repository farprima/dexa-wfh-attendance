import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
import { EMPLOYEE_SERVICE, Role } from '../shared/contracts.js';
import { AuthGuard, type AuthUser, CurrentUser, Roles } from './auth.guard.js';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto.js';
import { send } from './send.js';

@Controller('employees')
@UseGuards(AuthGuard)
@Roles([Role.Admin])
export class EmployeesController {
  constructor(@Inject(EMPLOYEE_SERVICE) private readonly employees: ClientProxy) {}

  @Get()
  findAll() {
    return send(this.employees, 'employee.findAll');
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return send(this.employees, 'employee.findOne', id);
  }

  @Post()
  create(@Body() employee: CreateEmployeeDto) {
    return send(this.employees, 'employee.create', employee);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() changes: UpdateEmployeeDto) {
    return send(this.employees, 'employee.update', { id, changes });
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    if (id === user.sub) throw new BadRequestException('You cannot delete your own account');
    await send(this.employees, 'employee.remove', id);
  }
}
