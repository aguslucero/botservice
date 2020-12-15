"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getHours = exports.minToHours = exports.canDr = exports.nariCanRoll = exports.canRoll = exports.getStats = exports.getBalance = exports.rollBalance7 = exports.rollBalance = void 0;
const embeds = __importStar(require("./Embeds"));
const balance_1 = __importDefault(require("./models/balance"));
const Pilot_1 = __importDefault(require("./models/Pilot"));
const comision = 0.99;
const discordavatar = "https://media1.tenor.com/images/54cc77830f82ef67471d8d868d09ad2f/tenor.gif?itemid=11230336";
const regex = /(\d+)/g;
const erroravatar = "https://i.pinimg.com/originals/4c/22/18/4c2218f5cc96ba76c0e590cd1dadb1bc.gif";
class CheckbalanceResponse {
    constructor(canroll, embedmessage) {
        this.canroll = canroll;
        this.embedmessage = embedmessage;
    }
}
function rollBalance(winner, losser, total) {
    return __awaiter(this, void 0, void 0, function* () {
        let win = yield balance_1.default.findOne({ userName: winner });
        let loser = yield balance_1.default.findOne({ userName: losser });
        let casino = yield balance_1.default.findOne({ userName: "Urlinja-Ragnaros" });
        if (casino && win && loser && win.userName != loser.userName) {
            let newWinnerBalance = win.balance - total + (total * 2 * comision);
            let newLosserBalance = loser.balance - total;
            //casino stats beging
            casino.earned = casino.earned + (total * 2 * (1 - comision));
            casino.rolls = casino.rolls + 1;
            //casino stats end
            win.rolls = win.rolls + 1;
            win.gambled = win.gambled + total;
            win.earned = win.earned - total + (total * 2 * comision);
            win.win = win.win + 1;
            loser.rolls = loser.rolls + 1;
            loser.gambled = loser.gambled + total;
            loser.earned = loser.earned - total;
            loser.lost = loser.lost + 1;
            win.balance = Math.floor(newWinnerBalance);
            loser.balance = Math.floor(newLosserBalance);
            try {
                yield loser.save();
                yield win.save();
                yield casino.save();
                return true;
            }
            catch (err) {
                console.log(err);
                return false;
            }
        }
        else {
            return false;
        }
    });
}
exports.rollBalance = rollBalance;
function rollBalance7(winner, losser, total) {
    return __awaiter(this, void 0, void 0, function* () {
        let win = yield balance_1.default.findOne({ userName: winner });
        let loser = yield balance_1.default.findOne({ userName: losser });
        let casino = yield balance_1.default.findOne({ userName: "Urlinja-Ragnaros" });
        if (casino && win && loser && win.userName != loser.userName) {
            let newWinnerBalance = win.balance - total + (total * 2 * comision);
            let newLosserBalance = loser.balance - total;
            casino.earned = casino.earned + (total * 2 * (1 - comision));
            casino.rolls = casino.rolls + 1;
            win.rolls = win.rolls + 1;
            win.gambled = win.gambled + total;
            win.earned = win.earned - total + (total * 2 * comision);
            win.win = win.win + 1;
            loser.rolls = loser.rolls + 1;
            loser.gambled = loser.gambled + total;
            loser.earned = loser.earned - total;
            loser.lost = loser.lost + 1;
            if (loser.userName === "NariBot") {
                newWinnerBalance = win.balance - total + (total * 4 * comision);
                newLosserBalance = loser.balance - (total * 3);
                win.earned = win.earned + ((total * 4 * comision) - total);
                loser.earned = loser.earned - (total * 3);
            }
            win.balance = Math.floor(newWinnerBalance);
            loser.balance = Math.floor(newLosserBalance);
            try {
                yield loser.save();
                yield win.save();
                yield casino.save();
                return true;
            }
            catch (err) {
                console.log(err);
                return false;
            }
        }
        else {
            return false;
        }
    });
}
exports.rollBalance7 = rollBalance7;
function getBalance(message, member) {
    var _a;
    let mention = (_a = message.mentions.members) === null || _a === void 0 ? void 0 : _a.first();
    let user = member;
    if (mention) {
        user = mention;
    }
    Pilot_1.default.findOne({ userName: user.displayName }).then(pilot => {
        console.log(pilot);
        let embedBalance = embeds.balaceCheck;
        embedBalance.fields = [];
        embedBalance.setDescription("");
        embedBalance.setAuthor(user.displayName, user.user.avatarURL() || discordavatar);
        embedBalance.addField("horas:", pilot === null || pilot === void 0 ? void 0 : pilot.minutes);
        message.channel.send(embedBalance);
    })
        .catch(err => console.log(err));
}
exports.getBalance = getBalance;
function getStats(message, member) {
    var _a;
    let mention = (_a = message.mentions.members) === null || _a === void 0 ? void 0 : _a.first();
    let user = member;
    if (mention) {
        user = mention;
    }
    balance_1.default.findOne({ userName: user.displayName }).then(balance => {
        console.log(balance);
        try {
            if ((balance === null || balance === void 0 ? void 0 : balance.rolls) > 0) {
                let embedStats = embeds.balaceCheck;
                embedStats.fields = [];
                embedStats.setAuthor(user.displayName, user.user.avatarURL() || discordavatar);
                embedStats.addField("Rolls:        ", "🎲" + (balance === null || balance === void 0 ? void 0 : balance.rolls), true);
                embedStats.addField("Total Ganado: ", Math.round(balance === null || balance === void 0 ? void 0 : balance.earned) + " 💰", true);
                embedStats.addField("Total jugado: ", Math.round(balance === null || balance === void 0 ? void 0 : balance.gambled) + " 💰", true);
                embedStats.addField("Rolls Ganados:", "🎲" + (balance === null || balance === void 0 ? void 0 : balance.win), true);
                embedStats.addField("Rolls Perdidos :", "🎲" + (balance === null || balance === void 0 ? void 0 : balance.lost), true);
                embedStats.addField("% de victorias :", Math.round(((balance === null || balance === void 0 ? void 0 : balance.win) * 100) / (balance === null || balance === void 0 ? void 0 : balance.rolls)) + "%", true);
                message.channel.send(embedStats);
            }
            else {
                let embedStats = embeds.balaceCheck;
                embedStats.fields = [];
                embedStats.setAuthor(user.displayName, erroravatar);
                embedStats.setDescription("Primero debes hacer una apuesta");
                message.channel.send(embedStats);
            }
        }
        catch (_a) {
            let embedStats = embeds.balaceCheck;
            embedStats.fields = [];
            embedStats.setAuthor(user.displayName, erroravatar);
            embedStats.setDescription("Error al cargar las estadisticas");
            message.channel.send(embedStats);
        }
    })
        .catch(err => console.log(err));
}
exports.getStats = getStats;
function canRoll(message, embedMessage, bet) {
    return __awaiter(this, void 0, void 0, function* () {
        let canroll = true;
        let allfields = embedMessage.fields;
        for (let field of allfields) {
            let name = field.name;
            let user = yield balance_1.default.findOne({ userName: name });
            if ((user === null || user === void 0 ? void 0 : user.balance) < bet) {
                field.name = "❌" + field.name;
                field.value = user === null || user === void 0 ? void 0 : user.balance.toString();
                console.log(field);
                embedMessage.setDescription("Cancelado, balance insuficiente");
                canroll = false;
            }
            else {
                field.value = user === null || user === void 0 ? void 0 : user.balance.toString();
            }
        }
        if (canroll) {
            embedMessage.setDescription('tiene 20 sg para aceptar el reto');
        }
        message.edit(embedMessage);
        return canroll;
    });
}
exports.canRoll = canRoll;
function nariCanRoll(message, embedMessage, bet) {
    return __awaiter(this, void 0, void 0, function* () {
        let canroll = true;
        let allfields = embedMessage.fields;
        for (let field of allfields) {
            let name = field.name;
            let user = yield balance_1.default.findOne({ userName: name });
            if ((user === null || user === void 0 ? void 0 : user.balance) < bet) {
                field.name = "❌" + field.name;
                field.value = user === null || user === void 0 ? void 0 : user.balance.toString();
                console.log(field);
                embedMessage.setDescription("Cancelado, balance insuficiente");
                canroll = false;
            }
            else {
                field.value = user === null || user === void 0 ? void 0 : user.balance.toString();
            }
        }
        if (canroll) {
            embedMessage.setDescription('esperando su eleccion');
        }
        message.edit(embedMessage);
        return canroll;
    });
}
exports.nariCanRoll = nariCanRoll;
function canDr(message, embedMessage, bet) {
    return __awaiter(this, void 0, void 0, function* () {
        let canroll = true;
        let allfields = embedMessage.fields;
        for (let field of allfields) {
            let name = field.name;
            let user = yield balance_1.default.findOne({ userName: name });
            if ((user === null || user === void 0 ? void 0 : user.balance) < bet) {
                field.name = "❌" + field.name;
                field.value = user === null || user === void 0 ? void 0 : user.balance.toString();
                console.log(field);
                embedMessage.setDescription("Cancelado, balance insuficiente");
                canroll = false;
            }
            else {
                field.value = user === null || user === void 0 ? void 0 : user.balance.toString();
            }
        }
        if (canroll) {
            embedMessage.setDescription('esperando aceptacion');
        }
        message.edit(embedMessage);
        return canroll;
    });
}
exports.canDr = canDr;
// ----------------------------------- aeromancos -----------------//
function minToHours(min) {
    let hours = Math.floor(min / 60);
    let minutes = min - hours * 60;
    var totalhours = hours + ":" + minutes;
    if (minutes < 10) {
        totalhours = hours + ":0" + minutes;
    }
    return totalhours.toString();
}
exports.minToHours = minToHours;
function getHours(message, member) {
    var _a;
    let mention = (_a = message.mentions.members) === null || _a === void 0 ? void 0 : _a.first();
    let user = member;
    if (mention) {
        user = mention;
    }
    Pilot_1.default.findOne({ userName: user.displayName }).then(pilot => {
        console.log(pilot);
        let embedBalance = embeds.balaceCheck;
        embedBalance.fields = [];
        embedBalance.setDescription("");
        embedBalance.setAuthor(user.displayName, user.user.avatarURL() || discordavatar);
        let totalhours = minToHours(pilot.minutes);
        embedBalance.addField("Total de horas:", totalhours);
        message.channel.send(embedBalance);
    })
        .catch(err => console.log(err));
}
exports.getHours = getHours;
