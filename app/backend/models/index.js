import { Sequelize } from "sequelize";
import UserModel from "./User.js";
import ProposedClubModel from "./ProposedClub.js";
import MorningClubModel from "./MorningClub.js";
import WednesdayClubModel from "./WednesdayClub.js";
import TeacherModel from "./Teacher.js";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD || "", 
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: console.log,
  }
);


const User = UserModel(sequelize);
const ProposedClub = ProposedClubModel(sequelize);
const MorningClub = MorningClubModel(sequelize);
const WednesdayClub = WednesdayClubModel(sequelize);
const Teacher = TeacherModel(sequelize);


export { User, ProposedClub, MorningClub, WednesdayClub, Teacher };

export default {
  sequelize,
  User,
  ProposedClub,
  MorningClub,
  WednesdayClub,
  Teacher,
};