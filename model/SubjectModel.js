import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: true
    },
    subjectName: {
        type: String,
        required: true
    },
    sessionNumber: {
        type: Number,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    sex: {
        type: String,
        required: true
    },
    trialCategory: {
        type: String,
        required: true
    },
    diagonalWindowSize:{
        type: Number,
        required: true
    },
    distanceEyesAndScreen: {
        type: Number,
        required: true
    },
    createDate: {
        type: Date,
        required: true
    },
})

export const UserModel = mongoose.model("User", UserSchema);