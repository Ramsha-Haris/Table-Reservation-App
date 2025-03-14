const { check, validationResult } = require('express-validator');

exports.getLogin = (req, res, next) => {
    console.log('login')
      res.render("auth/login", {
        pageTitle: "Login",
        currentPage: "login",
        isLoggedIn:  req.session.isLoggedIn,
      })
    
  };

  exports.postLogin = async (req, res, next) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email: email });
  
      if (!user) {
        return res.render('/auth/login', {
          pageTitle: 'Login',
          isLoggedIn: false,
          errorMessage: 'Invalid Email',
          oldInput: { email: email, password: password } // Preserve input
        });
      }
  
      // **Add the following code here:**
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.render('auth/login', {
          pageTitle: 'Login',
          isLoggedIn: false,
          errorMessage: 'Invalid Password',
          oldInput: { email: email, password: password } // Preserve input
        });
      }
  
      req.session.isLoggedIn = true;
      req.session.user = user;
      await req.session.save(); // Important: Await the save operation
  console.log("postLogin");
      res.redirect("/");
  
    } catch (err) {
      console.error("Error while logging in: ", err); // Use console.error for errors
      return next(err); // Pass the error to the next middleware
    }
  };


  exports.postLogout=(req,res,next)=>{
    req.session.destroy(() => {
      res.redirect("/login");
    });
    
  };


  exports.getSignup = (req, res, next) => {
    res.render("auth/signup", { 
      pageTitle: "Sign Up", 
      currentPage: "signup",
      isLoggedIn: false });
};



exports.postSignup = [
  // First Name validation
  check('firstName')
    .notEmpty()
    .withMessage('First name is required')
    .trim()
    .isLength({ min: 2 })
    .withMessage('First name must be at least 2 characters long')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters'),

  // Last Name validation
  check('lastName')
    .notEmpty()
    .withMessage('Last name is required')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Last name must be at least 2 characters long')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters'),

  // Email validation
  check('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),

  // Password validation
  check('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*().,?":{}|<>]/)
    .withMessage('Password must contain at least one special character')
    .trim(),

  // Confirm password validation
  check('confirm_password')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),

  // User Type validation
  check('userType')
    .notEmpty()
    .withMessage('User type is required')
    .isIn(['guest', 'host'])
    .withMessage('Invalid user type'),

  // Terms Accepted validation
  check('termsAccepted')
    .notEmpty()
    .withMessage('You must accept the terms and conditions')
    .custom(value => {
      if (value !== 'on') {
        throw new Error('You must accept the terms and conditions');
      }
      return true;
    }),

    async (req, res, next) => {
      const { firstName, lastName, email, password, userType } = req.body;
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        // Handle validation errors (e.g., re-render the form)
        return res.status(422).render('auth/signup', {
          pageTitle: 'Sign Up',
          currentPage : 'Signup',
          isLoggedIn: false,
          errorMessages: errors.array().map(error => error.msg),
          oldInput: {
            firstName,
            lastName,
            email,
            password,
            userType,
          },
        });
      }
  
      // Validation passed, create and save the user
      try {
        bcrypt.hash(password, 12).then(hashedPassword => {
          const user = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            userType: userType
          });
        
          user.save()
            .then(() => {
              res.redirect('/login');
            })
            .catch(err => {
              console.log("Error while creating user: ", err);
            });
        });
  
        await user.save();
        res.redirect('/login');
      } catch (err) {
        console.log("Error while creating user: ", err);
        // Handle the error appropriately (e.g., pass to error handling middleware)
        return next(err);
      }
    },
];

