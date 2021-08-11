// Name: Karl Merhi
// Seneca Student ID: 150828168
// Seneca email: kmerhi1@myseneca.ca
// Date: 08/08/2021
// WEB322 - Assignment #3

const express = require("express");
const handlebars = require("express-handlebars");
//const cookieParser = require("cookie-parser");
const session = require("express-session");
const mongoose = require("mongoose");
const userRouter = require("./routes/user");
const generalRouter = require("./routes/general");

require("dotenv").config();

const app = express();

const HTTP_PORT = process.env.PORT || 3000;

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

//app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use("/api/user", authRoutes);

app.use(session({secret: process.env.SECRET_KEY,
  resave: true,
  saveUninitialized: true
}));

app.use((req,res,next) => {
  res.locals.t = req.session.userInfo;
  next();
});

app.use("/public", express.static("public"));
app.use("/images", express.static(__dirname + "/public/images"));
app.use("/", generalRouter);
app.use("/user", userRouter);

app.engine(
  "hbs",
  handlebars({
    extname: "hbs",
  })
);
app.set("view engine", "hbs");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Connected to database`);
  })
  .catch((err) => {
    console.log(`Error connecting to database: ${err}`);
  });

app.listen(HTTP_PORT, onHttpStart);
