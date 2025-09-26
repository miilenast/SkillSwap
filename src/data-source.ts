import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
  username: process.env.DATABASE_USER || 'milena',
  password: process.env.DATABASE_PASSWORD || 'hobotnica',
  database: process.env.DATABASE_NAME || 'skillswap',
  entities: ['src/**/*.entity.ts'],
  migrations: [__dirname + '/database/migrations/*.ts'],
  synchronize: false,
} as DataSourceOptions);
