const mongoose = require("mongoose");

const citoyen = mongoose.model(
    "citoyen", {
        firstName: { type: String },
        lastName: { type: String },
        cin: { type: String },
        address: { type: String },
        sexe: { type: String },
    },
    "collection"
);

module.exports = { citoyen };