"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    userName: { type: String, unique: true },
    balance: Number,
    earned: Number,
    rolls: Number,
    gambled: Number,
    win: Number,
    lost: Number
});
exports.default = mongoose_1.model('Balance', schema);
