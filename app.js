import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { connectDB, User } from "./database.js";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const passportKey = process.env.PASSPORT_KEY;

app.use(
  session({
    secret: passportKey,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.listen(3000, () => {
  console.log("Server started on port 3000...");
});

connectDB();

app.get("/", async (req, res) => {
  try {
    res.render("home");
  } catch (error) {
    console.log(error);
  }
});

app.get("/login", async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error);
  }
});

app.get("/register", async (req, res) => {
  try {
    res.render("register");
  } catch (error) {
    console.log(error);
  }
});

app.post(
  "/register",
  async (req, res, next) => {
    try {
      await User.register(
        new User({ username: req.body.username }),
        req.body.password
      );

      passport.authenticate("local")(req, res, next);
    } catch (err) {
      console.error(err);
      res.redirect("/register");
    }
  },
  (req, res) => {
    res.redirect("/secrets");
  }
);

app.get("/secrets", async (req, res) => {
  try {
    const foundSecrets = await User.find({ secret: { $ne: null } });
    res.render("secrets", { foundSecrets: foundSecrets });
  } catch (error) {
    console.log(error);
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/secrets",
    failureRedirect: "/login",
  })
);

app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

app.get("/submit", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("submit");
  } else {
    res.redirect("/login");
  }
});

app.post("/submit", async (req, res) => {
  const submittedSecret = req.body.secret;
  try {
    const currentUser = await User.findById(req.user.id);
    if (currentUser) {
      currentUser.secret = submittedSecret;
      currentUser.save();
      res.redirect("/secrets");
    }
  } catch (error) {
    console.log(error);
  }
});
