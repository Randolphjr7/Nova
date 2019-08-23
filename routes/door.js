const express = require('express');
const router  = express.Router();


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('auth/login');
});

// Prevent users who are not logged in from accessing this page
router.use((req, res, next) => {
  if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
    console.log('fuck!!!!', req.session.currentUser);
    
    next(); // ==> go to the next route ---
  } else {                          //    |
    res.redirect("/login");         //    |
  }                                 //    |
}); // ------------------------------------                                
//     | 
//     V
router.get("/secret", (req, res, next) => {

      let user = req.session.currentUser;  
      console.log("/secret user is: ", user)
      res.render("secret", user);
    
});


module.exports = router;
