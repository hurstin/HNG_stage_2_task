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
      allowNull: true,
    },
    currency_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    exchange_rate: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    estimated_gdp: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    flag_url: {
      type: DataTypes.STRING,
      allowNull: true,
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
