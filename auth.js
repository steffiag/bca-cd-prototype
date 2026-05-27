import passport from "passport";
import session from "express-session";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as MicrosoftStrategy } from "passport-microsoft";
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
    new MicrosoftStrategy(
      {
        clientID: process.env.MICROSOFT_CLIENT_ID,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
        callbackURL: "/auth/microsoft/callback",
        scope: ["user.read"],
        tenant: process.env.MICROSOFT_TENANT_ID,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile._json.mail || profile._json.userPrincipalName;
          const firstName = profile.name?.givenName || "";
          const lastName = profile.name?.familyName || "";

          let dbUser = await db.User.findOne({ where: { usr_email: email } });
          if (!dbUser) {
            dbUser = await db.User.create({
              usr_email: email,
              usr_first_name: firstName,
              usr_last_name: lastName,
              usr_type_cde: "STD",
              usr_active: true,
            });
          }
          return done(null, profile);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  // passport.use(
  //   new GoogleStrategy(
  //     {
  //       clientID: process.env.GOOGLE_CLIENT_ID,
  //       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  //       callbackURL: "/auth/google/callback",
  //     },
  //     async (accessToken, refreshToken, profile, done) => {
  //       try {
  //         const email = profile.emails[0].value;
  //         const nameParts = profile.displayName.split(" ");
  //         let dbUser = await db.User.findOne({ where: { usr_email: email } });
  //         if (!dbUser) {
  //           dbUser = await db.User.create({
  //             usr_email: email,
  //             usr_first_name: nameParts[0] || "",
  //             usr_last_name: nameParts[1] || "",
  //             usr_type_cde: "STD",
  //             usr_active: true,
  //           });
  //         }
  //         return done(null, profile);
  //       } catch (err) {
  //         return done(err, null);
  //       }
  //     }
  //   )
  // );

  app.get("/auth/microsoft", passport.authenticate("microsoft"));

  app.get(
    "/auth/microsoft/callback",
    passport.authenticate("microsoft", { failureRedirect: "/" }),
    (_req, res) => {
      res.redirect(
        process.env.NODE_ENV === "production"
          ? "https://bcaclubs.bergen.org"
          : "http://localhost:5173"
      );
    }
  );

  // app.get(
  //   "/auth/google",
  //   passport.authenticate("google", { scope: ["profile", "email"] })
  // );

  // app.get(
  //   "/auth/google/callback",
  //   passport.authenticate("google", { failureRedirect: "/" }),
  //   (req, res) => {
  //     res.redirect(
  //       process.env.NODE_ENV === "production"
  //         ? "https://bca-cd-prototype-production.up.railway.app"
  //         : "http://localhost:5173"
  //     );
  //   }
  // );

  app.get("/auth/user", async (req, res) => {
    try {
      if (!req.user) return res.json(null);

      const email = req.user._json?.mail || req.user._json?.userPrincipalName;
      console.log("Looking up user with email:", email);

      const dbUser = await db.User.findOne({ where: { usr_email: email } });
      console.log("Found user:", dbUser);

      res.json({
        id: dbUser?.usr_id,
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
