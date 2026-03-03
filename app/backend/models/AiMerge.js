export default (sequelize, DataTypes) => {
  const AiMerge = sequelize.define("AiMerge", {
    club_a: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email_a: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    club_b: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email_b: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    suggestion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email_sent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return AiMerge;
};