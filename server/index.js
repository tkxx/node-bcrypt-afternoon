require("dotenv").config();
const express = require("express");
const session = require("express-session");
const massive = require("massive");
const { CONNECTION_STRING, SESSION_SECRET } = process.env;
const authCtrl = require("./controllers/authController");
const treasureCtrl = require("./controllers/treasureController");
const auth = require("./middleware/authMiddleware");

const app = express();
app.use(express.json());

const PORT = 4000;

massive(CONNECTION_STRING).then(db => {
  app.set("db", db);
  console.log("Connected :)");
});

app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET
  })
);

app.post("/auth/register", authCtrl.register);
app.post("/auth/login", authCtrl.login);
app.get("/auth/logout", authCtrl.logout);
app.get("/api/treasure/dragon", treasureCtrl.dragonTreasure);
app.get("/api/treasure/user", auth.usersOnly, treasureCtrl.getUserTreasure);
app.post("/api/treasure/user", auth.usersOnly, treasureCtrl.addUserTreasure);
app.get(
  "/api/treasure/all",
  auth.usersOnly,
  auth.adminsOnly,
  treasureCtrl.getAllTreasure
);

app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));
