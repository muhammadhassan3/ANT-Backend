import mongoose from "mongoose";

const TrialSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    block: {
        type: Number,
        required: true
    },
    cueLocation: {
        type: String,
        required: true
    },
    targetLocation: {
        type: String,
        required: true
    },
    targetDirection: {
        type: String,
        required: true
    },
    targetCongruency: {
        type: String,
        required: true
    },
    trialStartTime: {
        type: Date,
        required: true
    },
    targetOnTime: {
        type: Date,
        required: true
    },
    firstFixationDelay: {
        type: Number,
        required: true
    },
    rt: {
        type: Number,
        required: true
    },
    subjectResponse: {
        type: String,
        required: true
    },
    correctResponse: {
        type: String,
        required: true
    },
    correctNess: {
        type: Number,
        required: true
    },
    cueDelay: {
        type: Number,
        required: true
    },
    secondFixationDelay: {
        type: Number,
        required: true
    },
    lastFixationDelay: {
        type: Number,
        required: true
    },
    dateStarted: {
        type: Date,
        required: true
    },
    targetDelay: {
        type: Number,
        required: true
    },
})

export const TrialModel = mongoose.model("Trial Record", TrialSchema);