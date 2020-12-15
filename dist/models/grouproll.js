"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    embedId: { type: String, unique: true },
    finish: Boolean
});
exports.default = mongoose_1.model('GroupRoll', schema);
