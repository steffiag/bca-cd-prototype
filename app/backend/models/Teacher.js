import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Teacher = sequelize.define(
    "Teacher",
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
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      room: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      available: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      department: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      assigned_club: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      source: {
        type: DataTypes.STRING,
        defaultValue: "manual", // "manual" or "google_form"
      },
      form_response_id: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
    },
    {
      tableName: "teachers",
      timestamps: true,
    }
  );

  return Teacher;
};