import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Country = sequelize.define(
  'Country',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    capital: {
      type: DataTypes.STRING,
    },
    region: {
      type: DataTypes.STRING,
    },
    population: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    currency_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    exchange_rate: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    estimated_gdp: {
      type: DataTypes.FLOAT,
    },
    flag_url: {
      type: DataTypes.STRING,
    },
    last_refreshed_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'countries',
    timestamps: false,
  }
);

export default Country;
