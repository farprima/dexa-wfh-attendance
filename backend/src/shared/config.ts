const env = process.env;

export const config = {
  database: {
    type: 'mysql',
    host: env.DB_HOST ?? 'localhost',
    port: Number(env.DB_PORT ?? 3306),
    username: env.DB_USER ?? 'root',
    password: env.DB_PASSWORD ?? '',
    timezone: 'Z',
    synchronize: true,
  },
  gatewayPort: Number(env.PORT ?? 3000),
  jwtSecret: env.JWT_SECRET ?? '',
  employeeService: {
    host: env.EMPLOYEE_SERVICE_HOST ?? 'localhost',
    port: Number(env.EMPLOYEE_SERVICE_PORT ?? 4001),
  },
  attendanceService: {
    host: env.ATTENDANCE_SERVICE_HOST ?? 'localhost',
    port: Number(env.ATTENDANCE_SERVICE_PORT ?? 4002),
  },
} as const;
