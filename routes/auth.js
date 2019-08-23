const express = require("express");
const router = express.Router();

// BCrypt to encrypt passwords
const bcrypt         = require("bcryptjs");
const bcryptSalt     = 10;

// User model
const User           = require("../models/user");


// GET Sign-Up Route
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

// POST Sign-up route
router.post("/signup", (req, res, next) => {

    const username = req.body.username;
    const password = req.body.password;


    // validate username and password
    if(username === "" || password === ""){
      res.render("auth/signup", {errorMessage: "Indicate a username and a password to sign up"});
      return;
    }

    // check to see if indicated username is already defined in the database
    User.findOne({ "username": username })
    .then(user => {
      if (user !== null) {
          res.render("auth/signup", {
            errorMessage: "The username already exists!"
          });
          return;
      }

    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);  

    User.create({
      username,
      password: hashPass
    })
    .then(() => {
      res.redirect("/secret");
    })
    .catch(error => {
      console.log(error);
    })
  })
  .catch(error => {
    next(error);
  })
})

// GET log-in route then render auth/login
router.get(`/login`, (req,res,next) => {
  res.render("auth/login");
})

// POST login
router.post("/login", (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === "" || thePassword === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, username and password to sign up."
    });
    return;
  }

  User.findOne({ "username": theUsername })
  .then(user => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist."
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        console.log("the user is: ", user._id);
        
        res.redirect("/secret");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });
      }
  })
  .catch(error => {
    next(error);
  })
});

// GET logout
router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/login");
  });
});

module.exports = router;