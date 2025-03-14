const mongoose=require('mongoose');
const { stringify } = require('postcss');
const { v4: uuidv4 } = require('uuid');

const reservationSchema=new mongoose.Schema({

    guestName: {type:String , required:true},
    guestContactDetails: {type:Number , required:true},
    bookingStatus:String,
    bookingType: String ,
    date: {type: Date , required:true},
    timeSlot: {type:String , required:true},
    bookingDuration: {type:Number , required:true},
    CapacityCovers: {type:Number , required:true},
    tableName: {type:Array , required:true},
    bookingNotes: String ,
    reservationTag: Array,
    bookingNumber: { type: String, unique: true },
 
});

module.exports=mongoose.model("Bookings",reservationSchema);

