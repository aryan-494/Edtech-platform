const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    gender: {
        type: String,
        required: null,
    },
    dateOfBirth: {
        type: Date,
        required: null,
    },
    about: {
        type: String,
        trim: true,
    },
    contactNumber: {
        type: Number,
        trim: true,
    }
});

module.exports = mongoose.model("Profile", profileSchema);
