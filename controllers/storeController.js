
const Bookings=require("../models/booking")
const setupTables=require("../models/table")
const { v4: uuidv4 } = require('uuid');

// exports.getIndex = (req, res, next) => {
  
//   console.log(req.session, req.session.isLoggedIn);
//   Bookings.find().then((reservation)=>{
//     res.render("store/bookings", 
//       {
//       Bookings: reservation,
//       pageTitle: "Home",
//       currentPage: "bookings",
//       isLoggedIn:  req.session.isLoggedIn,
//     })
//   });
// };

function generateTimeSlots(startTime, endTime, intervalMinutes) {
  const timeSlots = [];
  let currentTime = new Date(`2000-01-01 ${startTime}`);

  const endTimeObj = new Date(`2000-01-01 ${endTime}`);

  while (currentTime <= endTimeObj) {
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');

    // Convert to 12-hour format with AM/PM
    const hours12 = (currentTime.getHours() % 12) || 12;
    const ampm = currentTime.getHours() >= 12 ? 'PM' : 'AM';
    const formattedTime12 = `${hours12}:${minutes} ${ampm}`;

    timeSlots.push(formattedTime12);

    currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
  }

  return timeSlots;
}


exports.getBookTable = async (req, res, next) => {
  try {
      const tables = await setupTables.find(); // Fetch all tables

      // Define the array of reservation tags
      const reservationTags = ['VIP', 'Regular', 'Family', 'Party']; // Example tags
      
      const startTime = '01:00 PM';
      const endTime = '11:00 PM'; // change to any end time.
      const intervalMinutes = 15;

      const timeSlot = generateTimeSlots(startTime, endTime, intervalMinutes);
    
    

      res.render('store/edit-book-table', {
          pageTitle: 'Book Table',
          currentPage: 'bookTable',
          tables: tables, // Pass tables to the view
          editing: false,
          reservationTags: reservationTags, // Pass reservation tags to the view
          timeSlot:timeSlot, // Pass array of time slot to the view
          isLoggedIn:  req.session.isLoggedIn,
          
      });
  } catch (error) {
      console.error('Error fetching tables:', error);
      res.status(500).send('An error occurred.');
  }
};

exports.getEditBooking = (req, res, next) => {
  
  const BookingdId=req.params.BookingId;
  const editing=req.query.editing ==='true';

  async function getBookingAndRender(BookingdId, editing, res) {
    try {
      const booking = await Bookings.findById(BookingdId);
      const tables = await setupTables.find(); // Fetch all tables
      const reservationTags = ['VIP', 'Regular', 'Family', 'Party']; // Example tags

      const startTime = '01:00 PM';
      const endTime = '11:00 PM'; // change to any end time.
      const intervalMinutes = 15;

      const timeSlot = generateTimeSlots(startTime, endTime, intervalMinutes);
  
      if (!booking) {
        console.log("Booking information not found");
        return res.redirect("/bookings");
      } else {
        console.log(BookingdId, editing, booking);
        console.log(booking.tableName)
        res.render("store/edit-book-table", {
          booking: booking,
          pageTitle: "Edit Your Booking",
          currentPage: "bookTable",
          tables: tables, 
          reservationTags: reservationTags ,// Pass reservation tags to the view
          timeSlot:timeSlot,
          editing: editing,
          isLoggedIn:  req.session.isLoggedIn
          
        });
      }
    } catch (error) {
      console.error("Error finding booking:", error);
      // Handle the error appropriately, e.g., send an error response or redirect
      return res.status(500).send("Internal Server Error"); // Example error response
    }
  }
  
  // Example usage (assuming you have BookingdId and editing variables):
  // Inside your route handler:
  getBookingAndRender(BookingdId, editing, res);
};

//get host booking
exports.getBookings = (req, res, next) => {
  Bookings.find().then((Bookings)=>{
    res.render("store/bookings", {
      Bookings: Bookings,
      pageTitle: "My Bookings",
      currentPage: "bookings",
      isLoggedIn:  req.session.isLoggedIn,
    })
  })
};

exports.postBookTable = async (req, res, next) => {
  try {
    const now = new Date();
    const formattedDate = now.toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    const uniqueId = uuidv4().slice(0, 8);
    const bookingNumber = `${formattedDate}-${uniqueId}`;

    const {
      guestName,
      guestContactDetails,
      bookingStatus,
      bookingType,
      date,
      timeSlot,
      bookingDuration,
      CapacityCovers,
      tableName,
      bookingNotes,
      reservationTag,
    } = req.body;

    const newBookings = new Bookings({
      guestName,
      guestContactDetails,
      bookingStatus,
      bookingType,
      date,
      timeSlot,
      bookingDuration,
      CapacityCovers,
      tableName,
      bookingNotes,
      reservationTag,
      bookingNumber,
    });

    await newBookings.save();
    res.redirect("/bookings"); // Redirect after successful save

  } catch (error) {
    console.error("Error saving booking:", error);
    res.status(500).send("Error saving booking");
  }
};

exports.postDeleteReservation = (req, res, next) => {
  const id=req.params.BookingId;
  console.log("Delete",id);
  Bookings.findByIdAndDelete(id).then(()=>{
    res.redirect("/bookings");
  }) ;
};


exports.postEditBooking = (req, res, next) => {
  const {id,guestName, guestContactDetails,bookingStatus,bookingType,date,timeSlot,bookingDuration,CapacityCovers,tableName,bookingNotes,reservationTag,bookingNumber}= req.body;

  Bookings.findById(id).then((reservation)=>{
    if(!reservation){
      console.log("No reservation information found for editing");
      return res.redirect("/bookings");
    }
    reservation.guestName=guestName;
    reservation.guestContactDetails=guestContactDetails;
    reservation.bookingStatus=bookingStatus;
    reservation.bookingType=bookingType;
    reservation.date=date;
    reservation.timeSlot=timeSlot;
    reservation.bookingDuration=bookingDuration;
    reservation.CapacityCovers=CapacityCovers;
    reservation.tableName=tableName;
    reservation.bookingNotes=bookingNotes;
    reservation.reservationTag=reservationTag;
    reservation.bookingNumber = bookingNumber; // Update the booking number
    console.log(reservation);
    return reservation.save();
  }).then(()=>{
    return res.redirect("/bookings");
  })
  .catch((err)=>{
    console.log("error while updating reservation ",err);
  });
};

