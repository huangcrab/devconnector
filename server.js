const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

//middle-ware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

//DB Config
//const db = require("./config/keys").local; local DB
let db;
if (process.env.NODE_ENV === "production") {
  db = require("./config/keys").mongoURI;
} else {
  db = require("./config/keys").local;
}

//connect to mlab
mongoose
  .connect(db)
  .then(() => {
    console.log("Mongodb Connected");
  })
  .catch(err => {
    console.log(err);
  });

//passport middleware
app.use(passport.initialize());
//passport config
require("./config/passport")(passport);

//use routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

//server static assets if in production
if (process.env.NODE_ENV === "production") {
  //set static folder
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
