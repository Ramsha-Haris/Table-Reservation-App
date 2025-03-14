// External Module
const express = require("express");
const storeRouter = express.Router();

// Local Module
const storeController = require("../controllers/storeController");

// storeRouter.get("/", storeController.getIndex);
// storeRouter.get("/homes", homesController.getHomes);
storeRouter.get("/bookings", storeController.getBookings);
storeRouter.get("/book-table", storeController.getBookTable);
storeRouter.post("/store/book-table", storeController.postBookTable);//.............
storeRouter.get("/store/edit-book-table/:BookingId?", storeController.getEditBooking);
storeRouter.post("/store/edit-book-table", storeController.postEditBooking);//.............
storeRouter.post("/delete-reservation/:BookingId", storeController.postDeleteReservation);


module.exports = storeRouter;
