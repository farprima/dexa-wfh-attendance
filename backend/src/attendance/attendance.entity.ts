import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('attendances')
@Unique(['employeeId', 'workDate'])
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  // Owned by the employee service, so it is a plain id with no foreign key.
  @Column({ name: 'employee_id' })
  employeeId: number;

  @Index()
  @Column({ name: 'work_date', type: 'date' })
  workDate: string;

  @Column({ name: 'checked_in_at', type: 'datetime' })
  checkedInAt: Date;

  @Column({ length: 255 })
  photo: string;
}
