const mongoose=require('mongoose');
const { stringify } = require('postcss');

const TableSchema=new mongoose.Schema({

    tableCode: {type:Number , required:true},
    tablecapacity: {type:Number , required:true},
    Location: {type:String , required:true},
    selectbranch:String
 })
 

module.exports=mongoose.model("Tables",TableSchema);

