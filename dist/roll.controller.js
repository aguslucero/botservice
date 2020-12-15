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
exports.nariroll = exports.rollawaitreaction = exports.dr = exports.cancelRollTimeout = exports.cancelRoll = exports.roll = exports.gr = void 0;
const grouproll_1 = __importDefault(require("./models/grouproll"));
const embeds = __importStar(require("./Embeds"));
const Balance = __importStar(require("./balance.controller"));
const balance_1 = __importDefault(require("./models/balance"));
const regex = /(\d+)/g;
const erroravatar = "https://i.pinimg.com/originals/4c/22/18/4c2218f5cc96ba76c0e590cd1dadb1bc.gif";
const discordavatar = "https://media1.tenor.com/images/54cc77830f82ef67471d8d868d09ad2f/tenor.gif?itemid=11230336";
const comision = 0.99;
////// GrouRoll  begin
class Winner {
    constructor(message, winner) {
        this.message = message;
        this.winner = winner;
    }
}
function grwinner(allfields, bet, reaction, embedmessage) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        let winer = " ";
        let loser = " ";
        let winnerNum = 0;
        let loserNum = bet + 1;
        let totalPeople = 0;
        for (let field of allfields) {
            let user = yield balance_1.default.findOne({ userName: field.name });
            if ((user === null || user === void 0 ? void 0 : user.balance) < bet) {
                field.name = "❌" + field.name;
                field.value = "Cancelado, balance insuficiente";
            }
            else {
                totalPeople = totalPeople + 1;
                let roll = +((_a = field.value.match(regex)) === null || _a === void 0 ? void 0 : _a.toString());
                if (roll > winnerNum) {
                    winer = field.name;
                    winnerNum = roll;
                }
                if (roll < loserNum) {
                    loser = field.name;
                    loserNum = roll;
                }
            }
        }
        if (totalPeople > 1) {
            let winner = (_b = reaction.message.guild) === null || _b === void 0 ? void 0 : _b.members.cache.find(user => user.displayName === winer);
            let losser = (_c = reaction.message.guild) === null || _c === void 0 ? void 0 : _c.members.cache.find(user => user.displayName === loser);
            let total = parseInt((winnerNum - loserNum).toString());
            try {
                let succes = yield Balance.rollBalance(winner === null || winner === void 0 ? void 0 : winner.displayName, losser === null || losser === void 0 ? void 0 : losser.displayName, total);
                if (succes && winner) {
                    let message = winer + " le gana  a: " + loser + ": " + Math.floor(total * comision) + "g";
                    embedmessage.setDescription(message);
                    embedmessage.fields = allfields;
                    embedmessage.setThumbnail(winner.user.avatarURL() || discordavatar);
                    reaction.message.edit(embedmessage);
                }
            }
            catch (err) {
                console.log(err);
                allfields = [];
                embedmessage.fields = allfields;
                embedmessage.title = " Ocurrio un error inesperado";
                embedmessage.setDescription("no se se puedo realizar el roll");
                embedmessage.setThumbnail(erroravatar);
                reaction.message.edit(embedmessage);
            }
        }
        else {
            allfields = [];
            embedmessage.fields = allfields;
            embedmessage.title = " no hay suficientes participantes";
            embedmessage.setDescription("no se pudieron encontrar participantes para esta ronda");
            embedmessage.setThumbnail(erroravatar);
            reaction.message.edit(embedmessage);
        }
    });
}
function timeoutandRoll(reaction, bet) {
    return __awaiter(this, void 0, void 0, function* () {
        setTimeout(() => {
            reaction.message.channel.messages.fetch({ around: reaction.message.id, limit: 1 })
                .then((msg) => __awaiter(this, void 0, void 0, function* () {
                let fetchedMsg = msg.first();
                let embedmessage = fetchedMsg === null || fetchedMsg === void 0 ? void 0 : fetchedMsg.embeds[0];
                let allfields = embedmessage === null || embedmessage === void 0 ? void 0 : embedmessage.fields;
                if (allfields && embedmessage) {
                    allfields.shift();
                    allfields.forEach((f) => f.value = (":game_die:" + Math.floor((Math.random() * bet) + 1).toString()));
                    yield grwinner(allfields, bet, reaction, embedmessage);
                }
            }));
        }, 15000);
    });
}
function gr(embedMessage, reaction) {
    var _a;
    let betText = (_a = embedMessage.title) === null || _a === void 0 ? void 0 : _a.match(regex);
    let grouproll;
    if (betText) {
        let bet = parseInt(betText.toString());
        grouproll_1.default.findOne({ embedId: reaction.message.id })
            .then(field => {
            if (!field) {
                let newgrouproll = {
                    embedId: reaction.message.id,
                    finish: false
                };
                grouproll = new grouproll_1.default(newgrouproll);
                grouproll.save()
                    .then(succes => {
                    timeoutandRoll(reaction, bet);
                })
                    .catch(err => console.log(err));
            }
            else {
                console.log("new entry");
            }
        })
            .catch(err => console.log(err));
    }
}
exports.gr = gr;
function rollwinner(allfields, message, bet) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let winer = " ";
        let loser = " ";
        let winnerNum = 0;
        let loserNum = 101;
        allfields.forEach(element => {
            var _a;
            let roll = +((_a = element.value.match(regex)) === null || _a === void 0 ? void 0 : _a.toString());
            if (roll > winnerNum) {
                winer = element.name;
                winnerNum = roll;
            }
            if (roll < loserNum) {
                loser = element.name;
                loserNum = roll;
            }
        });
        let winner = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.members.cache.find(user => user.displayName === winer);
        let losser = (_b = message.guild) === null || _b === void 0 ? void 0 : _b.members.cache.find(user => user.displayName === loser);
        try {
            let succes = yield Balance.rollBalance(winner === null || winner === void 0 ? void 0 : winner.displayName, losser === null || losser === void 0 ? void 0 : losser.displayName, bet);
            if (succes && winner) {
                return winner;
            }
            else {
                return null;
            }
        }
        catch (err) {
            return null;
        }
    });
}
function roll(embedmessage, message) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let betText = (_b = (_a = embedmessage.title) === null || _a === void 0 ? void 0 : _a.match(regex)) === null || _b === void 0 ? void 0 : _b.pop();
        if (betText) {
            let bet = parseInt(betText.toString());
            let allfields = embedmessage.fields;
            allfields.forEach((f) => {
                f.value = (":game_die:" + Math.floor((Math.random() * 100) + 1).toString());
            });
            if (allfields[0].value !== allfields[1].value) {
                rollwinner(allfields, message, bet)
                    .then(winner => {
                    console.log("winner", winner);
                    embedmessage.setDescription(winner.displayName + " gana un total de: " + Math.floor(bet * 2 * comision) + "g");
                    embedmessage.fields = allfields;
                    embedmessage.setThumbnail(winner.user.avatarURL() || discordavatar);
                    message.edit(embedmessage);
                })
                    .catch(err => {
                    console.log(err);
                    embedmessage.setDescription(" no se pudo realizar el roll");
                    embedmessage.setThumbnail(erroravatar);
                    embedmessage.fields = [];
                    message.edit(embedmessage);
                });
            }
            else {
                embedmessage.setDescription("Empate!");
                embedmessage.setThumbnail(erroravatar);
                message.edit(embedmessage);
            }
        }
    });
}
exports.roll = roll;
function cancelRoll(embedmessage, message) {
    embedmessage.setDescription('~~Roll cancelado!~~');
    let allfields = embedmessage.fields;
    allfields.forEach(f => {
        f.value = ":game_die: ~~Cancelado~~";
        f.name = "~~" + f.name + "~~";
    });
    message.edit(embedmessage);
}
exports.cancelRoll = cancelRoll;
function cancelRollTimeout(message) {
    setTimeout(() => {
        message.channel.messages.fetch({ around: message.id, limit: 1 })
            .then(msg => {
            var _a;
            let embedmessage = (_a = msg.first()) === null || _a === void 0 ? void 0 : _a.embeds[0];
            if (embedmessage && embedmessage.description === 'esperando aceptacion') {
                cancelRoll(embedmessage, message);
            }
        });
    }, 35000);
}
exports.cancelRollTimeout = cancelRollTimeout;
function dr(message) {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function* () {
        let embed = yield message.channel.messages.fetch({ around: message.id, limit: 1 });
        let embedmessage = (_a = embed.first()) === null || _a === void 0 ? void 0 : _a.embeds[0];
        embedmessage.setDescription('Death roll aceptado!');
        message.edit(embedmessage);
        try {
            let user1name = embedmessage.fields[0].name;
            let user2name = embedmessage.fields[1].name;
            let user1 = (_b = message.guild) === null || _b === void 0 ? void 0 : _b.members.cache.find(user => user.displayName === user1name);
            let user2 = (_c = message.guild) === null || _c === void 0 ? void 0 : _c.members.cache.find(user => user.displayName === user2name);
            let betText = (_e = (_d = embedmessage.title) === null || _d === void 0 ? void 0 : _d.match(regex)) === null || _e === void 0 ? void 0 : _e.pop();
            let bet = parseInt(betText.toString());
            let roll = Math.floor((Math.random() * bet) + 1);
            let rollmesage = yield message.channel.send(`${user2} tira los dados y obtiene:  **${roll}**`);
            yield rollmesage.react("🎲");
            drroll(rollmesage, user1, user2, roll, bet);
        }
        catch (err) {
            console.log(err);
            embedmessage.fields = [];
            embedmessage.title = " Ocurrio un error inesperado";
            embedmessage.setDescription("no se se puedo realizar el Death Roll");
            embedmessage.setThumbnail(erroravatar);
            message.edit(embedmessage);
        }
    });
}
exports.dr = dr;
function drroll(rollmesage, user1, user2, lastroll, bet) {
    return __awaiter(this, void 0, void 0, function* () {
        if (lastroll === 1) {
            let drembed = embeds.dr;
            try {
                yield Balance.rollBalance(user1.displayName, user2.displayName, bet);
                drembed.setTitle('Death Roll ' + bet + ' gold');
                drembed.setDescription(`${user2} tira los dados y obtiene: 1`);
                drembed.fields = [];
                drembed.addField('\u200B', `${user1}  Gana ${bet * 2 * comision}  \n  ${user2}  Pierde ${bet} `, false);
                drembed.setThumbnail(user1.user.avatarURL() || discordavatar);
                rollmesage.channel.send(drembed);
            }
            catch (err) {
                console.log(err);
                drembed.fields = [];
                drembed.title = " Ocurrio un error inesperado";
                drembed.setDescription("error al calcular nuevos balances, por favor contactar un administrador");
                rollmesage.channel.send(drembed);
            }
        }
        else {
            rollmesage.awaitReactions((reaction, user) => user == user2.user && (reaction.emoji.name == '🎲'), { max: 1, time: 15000 }).then((collected) => __awaiter(this, void 0, void 0, function* () {
                if (collected.first().emoji.name == '🎲') {
                    let roll = Math.floor((Math.random() * lastroll) + 1);
                    let rollmessageNew = yield rollmesage.channel.send(`${user1} tira los dados y obtiene: **${roll}**`);
                    yield rollmessageNew.react("🎲");
                    drroll(rollmessageNew, user2, user1, roll, bet);
                }
            })).catch(() => __awaiter(this, void 0, void 0, function* () {
                let roll = Math.floor((Math.random() * lastroll) + 1);
                let rollmessageNew = yield rollmesage.channel.send(`${user1} tira los dados y obtiene:  **${roll}**`);
                yield rollmessageNew.react("🎲");
                drroll(rollmessageNew, user2, user1, roll, bet);
            }));
        }
    });
}
function rollawaitreaction(message, embedmessage) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
exports.rollawaitreaction = rollawaitreaction;
function nariroll(embedmessage, message, election, user) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        let betText = (_b = (_a = embedmessage.title) === null || _a === void 0 ? void 0 : _a.match(regex)) === null || _b === void 0 ? void 0 : _b.pop();
        if (betText) {
            let bet = parseInt(betText.toString());
            let allfields = embedmessage.fields;
            let totalroll = 0;
            embedmessage.setDescription(((_c = message.member) === null || _c === void 0 ? void 0 : _c.displayName) + " apuesta " + betText);
            allfields.forEach((f) => {
                var _a;
                f.value = (":game_die:" + Math.floor((Math.random() * 6) + 1).toString());
                f.name = "NariBot";
                totalroll = totalroll + +((_a = f.value.match(regex)) === null || _a === void 0 ? void 0 : _a.toString());
            });
            narirollwinner(election, message, bet, totalroll, user)
                .then(winner => {
                console.log("winner", winner);
                embedmessage.setDescription(winner.displayName + " gana un total de: " + (bet * 2) * comision + "g");
                if (election === "7" && winner.displayName !== "NariBot") {
                    embedmessage.setDescription(winner.displayName + " gana un total de: " + (bet * 4) * comision + "g");
                }
                embedmessage.fields = allfields;
                embedmessage.setThumbnail(winner.user.avatarURL() || discordavatar);
                message.edit(embedmessage);
            })
                .catch(err => {
                console.log(err);
                embedmessage.setDescription(" no se pudo realizar el roll");
                embedmessage.fields = [];
                embedmessage.setThumbnail(erroravatar);
                message.edit(embedmessage);
            });
        }
    });
}
exports.nariroll = nariroll;
function narirollwinner(election, message, bet, totalRoll, user) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let winer = " ";
        let loser = " ";
        let winnerNum = 0;
        let loserNum = 101;
        let winner = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.members.cache.find(user => user.displayName === "NariBot");
        let losser = (_b = message.guild) === null || _b === void 0 ? void 0 : _b.members.cache.find(user => user.displayName === "NariBot");
        if ((election === "over" && totalRoll > 7) || (election === "under" && totalRoll < 7) || (election === "7" && totalRoll === 7)) {
            winner = user;
        }
        else {
            losser = user;
        }
        try {
            let succes = false;
            if (election === "7") {
                succes = yield Balance.rollBalance7(winner === null || winner === void 0 ? void 0 : winner.displayName, losser === null || losser === void 0 ? void 0 : losser.displayName, bet);
            }
            else {
                succes = yield Balance.rollBalance(winner === null || winner === void 0 ? void 0 : winner.displayName, losser === null || losser === void 0 ? void 0 : losser.displayName, bet);
            }
            if (succes && winner) {
                return winner;
            }
            else {
                return null;
            }
        }
        catch (err) {
            return null;
        }
    });
}
