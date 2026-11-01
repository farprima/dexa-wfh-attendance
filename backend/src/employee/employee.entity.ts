import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../shared/contracts.js';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 100 })
  position: string;

  @Column({ type: 'enum', enum: Role, default: Role.Employee })
  role: Role;

  @Column({ name: 'password_hash', select: false })
  passwordHash: string;
}
