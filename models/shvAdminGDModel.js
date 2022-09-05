const mongoose = require('mongoose');
const AdminGardenDesignerSchema  = new mongoose.Schema({

    Name: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required : true,
    },
    Phone:{
        type: String,
        required: true,
    },
    Qualifications:{
        type: String,
        required: true,
    },
    ProfilePic: {
        type: String,
        required: true,
    },
    FirstProjectPic: {
        type: String,
        required: true,
    },
    FirstProjectDesc:{
        type: String,
        required: true,
    },
    SecondProjectPic: {
        type: String,
        required: true,
    },
    SecondProjectDesc:{
        type: String,
        required: true,
    },
    ThirdProjectPic: {
        type: String,
        required: false,
    },
    ThirdProjectDesc:{
        type: String,
        required: false,
    },
    Created: {
        type: Date,
        required: true,
        default: Date.now, 
    },
});

module.exports = mongoose.model("GardenDesigners", AdminGardenDesignerSchema);

