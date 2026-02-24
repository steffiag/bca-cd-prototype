export default (sequelize, DataTypes) => {
  const ClubEnrollment = sequelize.define("club_enrollments", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    club_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    club_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  ClubEnrollment.associate = (models) => {
    ClubEnrollment.belongsTo(models.User, { foreignKey: "user_id" });
  };

  return ClubEnrollment;
};