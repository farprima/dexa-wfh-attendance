import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'node:crypto';
import { unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { diskStorage } from 'multer';
import { ATTENDANCE_SERVICE, EMPLOYEE_SERVICE, Role } from '../shared/contracts.js';
import { AuthGuard, type AuthUser, CurrentUser, Roles } from './auth.guard.js';
import { AttendanceQueryDto } from './dto.js';
import { send } from './send.js';

export const UPLOADS_DIR = join(process.cwd(), 'uploads');

const PHOTO_EXTENSIONS: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

const photoUpload = FileInterceptor('photo', {
  storage: diskStorage({
    destination: UPLOADS_DIR,
    filename: (_req, file, done) => done(null, randomUUID() + PHOTO_EXTENSIONS[file.mimetype]),
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, done) =>
    file.mimetype in PHOTO_EXTENSIONS
      ? done(null, true)
      : done(new BadRequestException('Photo must be a JPG, PNG or WebP image'), false),
});

type AttendanceRecord = { employeeId: number };

@Controller('attendances')
@UseGuards(AuthGuard)
export class AttendancesController {
  constructor(
    @Inject(ATTENDANCE_SERVICE) private readonly attendances: ClientProxy,
    @Inject(EMPLOYEE_SERVICE) private readonly employees: ClientProxy,
  ) {}

  @Post()
  @UseInterceptors(photoUpload)
  async checkIn(
    @CurrentUser() user: AuthUser,
    @UploadedFile(new ParseFilePipe()) photo: Express.Multer.File,
  ) {
    try {
      return await send(this.attendances, 'attendance.checkIn', {
        employeeId: user.sub,
        photo: photo.filename,
      });
    } catch (error) {
      await unlink(photo.path);
      throw error;
    }
  }

  @Get('me')
  findMine(@CurrentUser() user: AuthUser) {
    return send(this.attendances, 'attendance.findAll', { employeeId: user.sub });
  }

  @Get()
  @Roles([Role.Admin])
  async findAll(@Query() filter: AttendanceQueryDto) {
    const [attendances, employees] = await Promise.all([
      send<AttendanceRecord[]>(this.attendances, 'attendance.findAll', filter),
      send<{ id: number; name: string }[]>(this.employees, 'employee.findAll'),
    ]);
    const names = new Map(employees.map(({ id, name }) => [id, name]));
    return attendances.map((attendance) => ({
      ...attendance,
      employeeName: names.get(attendance.employeeId) ?? '(deleted employee)',
    }));
  }
}
