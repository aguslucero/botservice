"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startConnecion = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
function startConnecion() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.connect('mongodb+srv://' + process.env.USER + ':' + process.env.PASSWORD + '@cluster0-56yrx.mongodb.net/assistence?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useFindAndModify: false
        })
            .then(db => console.log('base de datos conectada'))
            .catch(err => console.log(err));
    });
}
exports.startConnecion = startConnecion;
