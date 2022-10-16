const express = require('express');
const mongoose = require('mongoose');

const User = require('../DbModels/UserModel');

const TransactionSchema = new mongoose.Schema({
    userBy : {
        type : String,                                        //Id to differentiate between users of group(Get from JWT)
        required : true
    },
    transactionDate : Date,
    transactionAmount : {
        type : Number,
        requires : true
    }
});

module.exports = new mongoose.model('Transactions', TransactionSchema);