const User = require("../models/user");
const { sendEmail } = require("../utils/helpers");
const bcrypt = require("bcryptjs");

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegexp = /^[A-Za-z0-9]{6,12}$/;

exports.getRegistration = (req, res) => {
  res.render("user/registration", {
    user: true,
    layout: false,
  });
};

exports.getLogin = (req, res) => {
  res.render("user/login", {
    user: true,
    layout: false,
  });
};

exports.getDashboard = (req, res) => {
    res.render("user/dashboard", {
      user: true,
      layout: false,
    });
  };

  exports.getAdminDashboard = (req, res) => {
    res.render("user/adminDashboard", {
      user: true,
      layout: false,
    });
  };

  exports.getLogout = (req,res) => {
    req.session.destroy();
    res.redirect("./login");
};

exports.postRegistration = async(req, res) => {

  const newUser = {
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: req.body.password,
    // birthday: req.body.birthday
  };

  const errors = [];

  await User.findOne({ email: newUser.email })
  .then(t => {
    if (t) {
      errors.push("Email already exist");
    }
  })
  .catch((err) => console.log(`Error: ${err}`));

  if (emailRegexp.test(newUser.email) == false) {
    errors.push("Please enter a valid email");
  }
  if (newUser.firstname.trim() == "") {
    errors.push("Please enter your first name");
  }
  if (newUser.lastname.trim() == "") {
    errors.push("Please enter your last name");
  }
  if (passwordRegexp.test(newUser.password) == false) {
    errors.push(
      "Please enter a valid password (Must contain letters and numbers)"
    );
  }
  if (errors.length > 0) {
    console.log(errors);
    res.render("user/registration", {
      user: true,
      layout: false,
      messages: errors,
    });
  } else {
    const t = new User(newUser);
    t.save()
      .then(() => {
        console.log(`User was added to the database check your email!`);
        sendEmail({
          to: newUser.email,
          subject: "Welcome to AirBnb",
          text: `Hi ${newUser.firstname}, we are so happy to have you be a part of AirBnb.`,
        });
      })
      .catch((err) => console.log(`Error`));
      req.session.userInfo = t;
      res.redirect("/user/dashboard");
  } 
};

exports.postLogin = async(req, res) => {
  const errors = [];

  const newUser = {
    email: req.body.email,
    password: req.body.password,
  };

  if (newUser.email.trim() == "") {
    errors.push("Please enter an email");
  }
  if (newUser.password.trim() == "") {
    errors.push("Please enter a password");
  }
  if (errors.length > 0) {
    console.log(errors);
    res.render("user/login", {
      layout: false,
      user: true,
      messages: errors,
    });
  } else {
    await User.findOne({ email: newUser.email }).then((t) => {
      if (t == null) {
        errors.push("Your email does not match any user in our data base");
        res.render("user/login", {
          user: true,
          layout: false,
          messages: errors,
        }); 
      } else {
          console.log(t);
         // console.log(password);
          console.log(newUser);
          bcrypt.compare(newUser.password, t.password)
          .then(isMatched => {

              // Password is correct
              if (isMatched == true) {
                  req.session.userInfo = t;
                  
                  // User login
                  if (t.isAdmin == false) {
                      res.redirect("/user/dashboard");
                  } else {
                      req.session.adminInfo = t;
                      res.redirect("/user/adminDashboard");
                  }
            } else {
              errors.push(
                "Sorry you have either entered the wrong email and/or password"
              );
              res.render("user/login", {
                user: true,
                layout: false,
                messages: errors,
              });
            }
          })
          .catch((err) => console.log(`Error: ${err}`));
      }
    });
  }
};
