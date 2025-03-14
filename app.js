// Core Module
const path = require('path');

// External Module
const express = require('express');
const mongoose=require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser'); // Import body-parser
const session=require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);

//Local Module
const storeRouter = require("./routes/storeRouter")
const hostRouter = require("./routes/hostRouter")
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controllers/errors");
const authRouter = require('./routes/authRouter');





const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));


const MONGO_DB_URL = "mongodb+srv://root:root@booking.kpoxe.mongodb.net/?retryWrites=true&w=majority&appName=Booking"; // Replace with your actual connection string

const store = new MongoDBStore({
  uri: MONGO_DB_URL,
  collection: 'sessions'
});


app.use(session({
    // Secret key used to sign the session ID cookie and encrypt session data
    secret: 'Table Secret',
    // Forces session to be saved back to the session store, even if not modified
    resave: false,
    // Forces a session that is "uninitialized" to be saved to the store
    saveUninitialized: true,
    store:store,
}));

app.use(cookieParser()); 



app.use((req, res, next) => {
   req.session.isLoggedIn = req.get('Cookie')?.split('=')[1] || false;
  console.log( "Login State",req.session.isLoggedIn);
  next();
});


app.use("/host", (req, res, next) => {
  if (! req.session.isLoggedIn) {
      return res.redirect("/login");
  }
  next();
});
app.use(storeRouter);
app.use("/host",hostRouter);
app.use(authRouter);

app.use(express.static(path.join(rootDir, 'public')))

app.use(errorsController.pageNotFound);
const PORT = 3009;
mongoose.connect(MONGO_DB_URL)
.then(()=>{
  console.log("Successfully connected to Mongodb");
  app.listen(PORT, () => {
    console.log(`Server running on address http://localhost:${PORT}`);
  });

})
.catch((err)=>{
  console.log("Error occur while connecting to db",err)

});



