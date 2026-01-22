import { DataTypes } from "sequelize";

export default (sequelize) => {
  const WednesdayClub = sequelize.define(
    "WednesdayClub",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      club_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      leader_email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      advisor: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      room: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      members_raw: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "Pending",
      },
      source: {
        type: DataTypes.STRING,
        defaultValue: "manual", // "manual" or "google_form"
      },
    },
    {
      tableName: "wednesday_clubs",
      timestamps: true,
    }
  );

  return WednesdayClub;
};