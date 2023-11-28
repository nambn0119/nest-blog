import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 33061,
  username: 'root',
  password: 'root',
  database: 'blog_nestjs',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  subscribers: ['dist/subscribers/**/*{.js,.ts}'],
  // autoLoadEntities: true,
  synchronize: true,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
