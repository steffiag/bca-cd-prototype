import passport from "passport";
import session from "express-session";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import db from "./models/index.js";

export default function setupAuth(app) {
  app.use(
    session({
      secret: "club-dashboard-secret",
      resave: false,
      saveUninitialized: false,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:4000/auth/google/callback",
      },
      (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
      }
    )
  );

  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
      res.redirect("http://localhost:5173");
    }
  );

  app.get("/auth/user", async (req, res) => {
  try {
    if (!req.user) return res.json(null);

    const email = req.user.emails[0].value;
    console.log("Looking up user with email:", email); // Debug log
    
    const dbUser = await db.User.findOne({ where: { usr_email: email } });
    console.log("Found user:", dbUser); // Debug log

    res.json({
      displayName: req.user.displayName,
      email,
      userType: dbUser?.usr_type_cde || "STD",
      isTeacher: dbUser?.usr_type_cde === "TCH",
    });
  } catch (error) {
    console.error("Error in /auth/user:", error);
    res.status(500).json({ error: error.message });
  }
});
  
  app.get("/auth/logout", (req, res) => {
    req.logout(() => {
      req.session.destroy();
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out" });
    });
  });
}