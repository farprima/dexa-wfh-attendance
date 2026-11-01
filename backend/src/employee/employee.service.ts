import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcryptjs';
import { QueryFailedError, Repository } from 'typeorm';
import { EmployeeInput, Role, rpcError } from '../shared/contracts.js';
import { Employee } from './employee.entity.js';

@Injectable()
export class EmployeeService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Employee)
    private readonly employees: Repository<Employee>,
  ) {}

  async onApplicationBootstrap() {
    if (await this.employees.exists()) return;
    await this.create({
      name: 'Admin HRD',
      email: 'admin@dexa.test',
      position: 'HR Manager',
      role: Role.Admin,
      password: 'admin123',
    });
    await this.create({
      name: 'Budi Santoso',
      email: 'budi@dexa.test',
      position: 'Software Engineer',
      role: Role.Employee,
      password: 'budi123',
    });
  }

  async login(email: string, password: string) {
    const employee = await this.employees
      .createQueryBuilder('employee')
      .addSelect('employee.passwordHash')
      .where({ email })
      .getOne();
    if (!employee || !(await bcrypt.compare(password, employee.passwordHash))) {
      throw rpcError(401, 'Wrong email or password');
    }
    return this.findOne(employee.id);
  }

  findAll() {
    return this.employees.find({ order: { name: 'ASC' } });
  }

  async findOne(id: number) {
    const employee = await this.employees.findOneBy({ id });
    if (!employee) throw rpcError(404, 'Employee not found');
    return employee;
  }

  create(input: EmployeeInput) {
    return this.save(this.employees.create(input), input.password);
  }

  async update(id: number, input: Partial<EmployeeInput>) {
    const employee = await this.findOne(id);
    return this.save(this.employees.merge(employee, input), input.password);
  }

  async remove(id: number) {
    const { affected } = await this.employees.delete(id);
    if (!affected) throw rpcError(404, 'Employee not found');
  }

  private async save(employee: Employee, password?: string) {
    if (password) employee.passwordHash = await bcrypt.hash(password, 10);
    try {
      const { id } = await this.employees.save(employee);
      return this.findOne(id);
    } catch (error) {
      if (error instanceof QueryFailedError && error.driverError.code === 'ER_DUP_ENTRY') {
        throw rpcError(409, 'Email is already registered');
      }
      throw error;
    }
  }
}
