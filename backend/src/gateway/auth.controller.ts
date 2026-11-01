import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { ClientProxy } from '@nestjs/microservices';
import { EMPLOYEE_SERVICE } from '../shared/contracts.js';
import type { AuthUser } from './auth.guard.js';
import { LoginDto } from './dto.js';
import { send } from './send.js';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(EMPLOYEE_SERVICE) private readonly employees: ClientProxy,
    private readonly jwt: JwtService,
  ) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() credentials: LoginDto) {
    const user = await send<Omit<AuthUser, 'sub'> & { id: number }>(
      this.employees,
      'employee.login',
      credentials,
    );
    const token = await this.jwt.signAsync<AuthUser>({
      sub: user.id,
      name: user.name,
      role: user.role,
    });
    return { token, user };
  }
}
