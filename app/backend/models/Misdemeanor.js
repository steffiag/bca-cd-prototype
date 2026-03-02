export default (sequelize, DataTypes) => {
  const Misdemeanor = sequelize.define("Misdemeanor", {
    club_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    misdemeanor_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  return Misdemeanor;
};