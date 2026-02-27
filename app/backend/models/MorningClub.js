import { DataTypes } from "sequelize";

export default (sequelize) => {
  const MorningClub = sequelize.define(
    "MorningClub",
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
      day: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      time: {
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
      merge: {
        type: DataTypes.STRING,
        defaultValue: "No",
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
      mission: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      photo_file_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "morning_clubs",
      timestamps: true,
    }
  );

  return MorningClub;
};