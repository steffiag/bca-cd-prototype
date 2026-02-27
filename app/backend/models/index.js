import { Sequelize, DataTypes } from "sequelize";
import UserModel from "./User.js";
import ProposedClubModel from "./ProposedClub.js";
import MorningClubModel from "./MorningClub.js";
import WednesdayClubModel from "./WednesdayClub.js";
import TeacherModel from "./Teacher.js";
import ClubEnrollmentModel from "./ClubEnrollment.js";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: console.log,
  }
);

// Initialize models
const User = UserModel(sequelize);
const ProposedClub = ProposedClubModel(sequelize);
const MorningClub = MorningClubModel(sequelize);
const WednesdayClub = WednesdayClubModel(sequelize);
const Teacher = TeacherModel(sequelize);
const ClubEnrollment = ClubEnrollmentModel(sequelize, DataTypes);

// Setup associations
User.hasMany(ClubEnrollment, { foreignKey: "user_id" });
ClubEnrollment.belongsTo(User, { foreignKey: "user_id" });

MorningClub.hasMany(ClubEnrollment, { foreignKey: "club_id", constraints: false });
ClubEnrollment.belongsTo(MorningClub, { foreignKey: "club_id", constraints: false });

WednesdayClub.hasMany(ClubEnrollment, { foreignKey: "club_id", constraints: false });
ClubEnrollment.belongsTo(WednesdayClub, { foreignKey: "club_id", constraints: false });

// Export a single object as default
export default {
  sequelize,
  User,
  ProposedClub,
  MorningClub,
  WednesdayClub,
  Teacher,
  ClubEnrollment,
};