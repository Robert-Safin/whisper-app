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
      // Register the user using passport-local-mongoose
      await User.register(
        new User({ username: req.body.username }),
        req.body.password
      );

      // Authenticate the user and start a session (call the middleware explicitly)
      passport.authenticate("local")(req, res, next);
    } catch (err) {
      console.error(err);
      res.redirect("/register");
    }
  },
  (req, res) => {
    // Add this callback function to handle the result of the middleware
    res.redirect("/secrets");
  }
);

app.get("/secrets", async (req, res) => {
  if (req.isAuthenticated()) {
    res.render("secrets");
  } else {
    res.redirect("register");
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
