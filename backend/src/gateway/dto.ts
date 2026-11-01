import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '../shared/contracts.js';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class CreateEmployeeDto {
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsNotEmpty()
  @MaxLength(100)
  position: string;

  @IsEnum(Role)
  role: Role;

  @MinLength(6)
  password: string;
}

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}

export class AttendanceQueryDto {
  @IsDateString()
  from: string;

  @IsDateString()
  to: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  employeeId?: number;
}
