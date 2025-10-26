import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('hng_stage_2', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
});

export default sequelize;
