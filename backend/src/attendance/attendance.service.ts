import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, QueryFailedError, Repository } from 'typeorm';
import { AttendanceFilter, rpcError } from '../shared/contracts.js';
import { Attendance } from './attendance.entity.js';

// The working day is counted in Jakarta time, wherever the server runs.
const toWorkDate = (date: Date) => date.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendances: Repository<Attendance>,
  ) {}

  async checkIn(employeeId: number, photo: string) {
    const now = new Date();
    try {
      return await this.attendances.save({
        employeeId,
        photo,
        checkedInAt: now,
        workDate: toWorkDate(now),
      });
    } catch (error) {
      if (error instanceof QueryFailedError && error.driverError.code === 'ER_DUP_ENTRY') {
        throw rpcError(409, 'You have already checked in today');
      }
      throw error;
    }
  }

  findAll({ employeeId, from, to }: AttendanceFilter) {
    return this.attendances.find({
      where: {
        ...(employeeId ? { employeeId } : {}),
        ...(from && to ? { workDate: Between(from, to) } : {}),
      },
      order: { checkedInAt: 'DESC', id: 'DESC' },
    });
  }
}
