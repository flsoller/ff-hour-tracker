import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('app-db', 'postgres', 'postgres', {
  host: 'postgres',
  dialect: 'postgres',
});

export const connectDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
