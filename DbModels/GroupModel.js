const express = require('express');
const mongoose = require('mongoose');



const {TransacationSchema} = require(__dirname +'/TransactionModel.js');


const GroupSchema = mongoose.Schema({
    groupName : {
        type : String,
        required : true
    },
    participants : {
        type : [String]
    },
    transaction : {
        type : [TransacationSchema]
    }
});


module.exports = new mongoose.model('Group', GroupSchema);