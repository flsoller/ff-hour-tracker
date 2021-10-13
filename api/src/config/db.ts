import { Sequelize } from 'sequelize';

const NODE_ENV_DEV: boolean =
  process.env.NODE_ENV === 'development' ? true : false;

const sequelize = new Sequelize('app-db', 'postgres', 'postgres', {
  host: 'postgres',
  dialect: 'postgres',
  sync: { alter: NODE_ENV_DEV },
});

export default sequelize;
