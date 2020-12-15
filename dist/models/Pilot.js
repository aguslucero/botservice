"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    userName: { type: String, unique: true },
    minutes: Number,
    newEntry: String,
});
exports.default = mongoose_1.model('pilot', schema);
