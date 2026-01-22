import { DataTypes } from "sequelize";

export default (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      usr_id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
      },
      usr_first_name: { 
        type: DataTypes.STRING, 
        allowNull: true 
      },
      usr_last_name: { 
        type: DataTypes.STRING, 
        allowNull: true 
      },
      usr_email: { 
        type: DataTypes.STRING, 
        allowNull: false 
      },
      usr_type_cde: { 
        type: DataTypes.STRING(4), 
        allowNull: true 
      },
      usr_class_year: { 
        type: DataTypes.INTEGER, 
        allowNull: true 
      },
      academy_cde: { 
        type: DataTypes.STRING, 
        allowNull: true 
      },
      usr_active: { 
        type: DataTypes.BOOLEAN, 
        allowNull: true,
        defaultValue: true
      },
      usr_grade_lvl: { 
        type: DataTypes.INTEGER, 
        allowNull: true 
      },
    },
    {
      tableName: "user",
      timestamps: false,
      freezeTableName: true,
    }
  );

  return User;
};