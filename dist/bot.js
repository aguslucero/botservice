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
const dotenv_1 = require("dotenv");
dotenv_1.config();
const discord_js_1 = require("discord.js");
const Discord = require('discord.js');
const embeds = __importStar(require("./Embeds"));
const db = __importStar(require("./mongodb"));
const balance_1 = __importDefault(require("./models/balance"));
const balanceController = __importStar(require("./balance.controller"));
const Pilot_1 = __importDefault(require("./models/Pilot"));
var moment = require('moment-timezone');
moment().tz("America/Argentina/Buenos_Aires").format();
const GphApiClient = require("giphy-js-sdk-core");
const { GIPHY_TOKEN } = process.env;
const personaje = [];
const client = new discord_js_1.Client();
const giphy = GphApiClient(GIPHY_TOKEN);
const discordavatar = "https://media1.tenor.com/images/54cc77830f82ef67471d8d868d09ad2f/tenor.gif?itemid=11230336";
let index = 0;
let emb = "embed";
const erroravatar = "https://i.pinimg.com/originals/4c/22/18/4c2218f5cc96ba76c0e590cd1dadb1bc.gif";
client.once("ready", () => {
    console.log("Bot is ready!");
    db.startConnecion();
});
client.on('guildMemberAdd', (member) => {
    let newrole = member.guild.roles.cache.find(r => r.name === "New");
    let welcomeChanel = member.guild.channels.cache.find(x => x.id === "723311059200639047");
    member.roles.add(newrole);
});
client.on("message", (message) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    if (message.guild) {
        let bolsaChannel = message.guild.channels.cache.find(x => x.id === "723311059200639047");
        let gamblingChannel = message.guild.channels.cache.find(x => x.id === "760602851444523028");
        let discordUser = message.member;
        var regex = /(\d+)/g;
        let aPagar = 0;
        let bolsaActual = 0;
        // GROUP ROLL 
        if (message.content.startsWith('.gr')) {
            let embedmessage = embeds.gr;
            embedmessage.setTitle("en servicio ");
            message.channel.send(embedmessage).then(function (message) {
                message.react("👍");
            }).catch(function () {
            });
        }
        //set balance
        if (message.content.startsWith('.setbalance')) {
            if (message.channel.id === "765095046101598208") {
                let member = message.member;
                let admin = member.guild.roles.cache.find(r => r.name === "admin");
                let goldColector = member.guild.roles.cache.find(r => r.name === "Gold collector");
                let newbalance = parseInt((_b = (_a = message.content.match(regex)) === null || _a === void 0 ? void 0 : _a.pop()) === null || _b === void 0 ? void 0 : _b.toString());
                if (member.roles.cache.has(admin.id) || member.roles.cache.has(goldColector.id)) {
                    let user = (_c = message.mentions.members) === null || _c === void 0 ? void 0 : _c.first();
                    balance_1.default.findOneAndUpdate({ userName: user.displayName }, { balance: newbalance }).then(balance => {
                        message.channel.send(`${member} actualiza el balance de ${user} nuevo balance: ${newbalance}`);
                    })
                        .catch(err => console.log(err));
                }
            }
        }
        if (message.content.startsWith('.addhours')) {
            if (message.channel.id === "776638753548271626") {
                let member = message.member;
                let admin = member.guild.roles.cache.find(r => r.name === "admin");
                let goldColector = member.guild.roles.cache.find(r => r.name === "Gold collector");
                let newhours = parseInt((_e = (_d = message.content.match(regex)) === null || _d === void 0 ? void 0 : _d.pop()) === null || _e === void 0 ? void 0 : _e.toString());
                var hour = 0;
                var minutes = 0;
                var newhours2 = message.content.split(' ').pop();
                console.log("nuevahora" + newhours2);
                if (newhours2.search(":") > -1) {
                    hour = parseInt(newhours2.split(":")[0]);
                    minutes = parseInt(newhours2.split(":")[1]);
                    console.log(hour, minutes);
                }
                if (member.roles.cache.has(admin.id) || member.roles.cache.has(goldColector.id)) {
                    let user = (_f = message.mentions.members) === null || _f === void 0 ? void 0 : _f.first();
                    let userBalance = yield Pilot_1.default.findOne({ userName: user.displayName });
                    if ((hour && minutes) || (hour && minutes === 0) || (minutes && hour === 0)) {
                        if (userBalance && (hour > 0 || minutes > 0)) {
                            let totalminutes = hour * 60 + minutes;
                            userBalance.minutes = userBalance.minutes + totalminutes;
                            userBalance.save().then((succes) => __awaiter(void 0, void 0, void 0, function* () {
                                message.channel.send(`${member} agrega ${balanceController.minToHours(totalminutes)} horas a ${user}`);
                                let balanceckeck = yield message.channel.send(`.b ${user}`);
                                balanceckeck.delete();
                            })).catch(err => console.log(err));
                        }
                    }
                    else {
                        message.channel.send("error en el formato use .addhours @nombre hh:mm");
                    }
                }
                //// format hh:mm
            }
        }
        if (message.content.startsWith('.subhours')) {
            if (message.channel.id === "776638753548271626") {
                let member = message.member;
                let admin = member.guild.roles.cache.find(r => r.name === "admin");
                let goldColector = member.guild.roles.cache.find(r => r.name === "Gold collector");
                let newhours = parseInt((_h = (_g = message.content.match(regex)) === null || _g === void 0 ? void 0 : _g.pop()) === null || _h === void 0 ? void 0 : _h.toString());
                var hour = 0;
                var minutes = 0;
                var newhours2 = message.content.split(' ').pop();
                console.log("nuevahora" + newhours2);
                if (newhours2.search(":") > -1) {
                    hour = parseInt(newhours2.split(":")[0]);
                    minutes = parseInt(newhours2.split(":")[1]);
                    console.log(hour, minutes);
                }
                if (member.roles.cache.has(admin.id) || member.roles.cache.has(goldColector.id)) {
                    let user = (_j = message.mentions.members) === null || _j === void 0 ? void 0 : _j.first();
                    let userBalance = yield Pilot_1.default.findOne({ userName: user.displayName });
                    if ((hour && minutes) || (hour && minutes === 0) || (minutes && hour === 0)) {
                        if (userBalance && (hour > 0 || minutes > 0)) {
                            let totalminutes = hour * 60 + minutes;
                            userBalance.minutes = userBalance.minutes - totalminutes;
                            userBalance.save().then((succes) => __awaiter(void 0, void 0, void 0, function* () {
                                message.channel.send(`${member} le resta ${balanceController.minToHours(totalminutes)} horas a ${user}`);
                                let balanceckeck = yield message.channel.send(`.b ${user}`);
                                balanceckeck.delete();
                            })).catch(err => console.log(err));
                        }
                    }
                    else {
                        message.channel.send("error en el formato use .subhours @nombre hh:mm");
                    }
                }
                //// format hh:mm
            }
        }
        // add pilot
        if (message.content.startsWith('.alta')) {
            let name = (_l = (_k = message.mentions.members) === null || _k === void 0 ? void 0 : _k.first()) === null || _l === void 0 ? void 0 : _l.displayName;
            let exist = yield Pilot_1.default.findOne({ userName: name });
            if (!exist) {
                let newPilot = {
                    userName: name,
                    minutes: 0,
                    newEntry: "",
                };
                let pilot = new Pilot_1.default(newPilot);
                pilot.save().then(succes => {
                    var _a, _b;
                    message.channel.send("se ha agregado un nuevo piloto: " + pilot.userName);
                    let aereomanco = message.guild.roles.cache.find(r => r.name === "AEREOMANCO");
                    (_a = message.member) === null || _a === void 0 ? void 0 : _a.setNickname(name);
                    (_b = message.member) === null || _b === void 0 ? void 0 : _b.roles.add(aereomanco);
                    message.delete();
                })
                    .catch(err => {
                    var _a;
                    console.log(err);
                    (_a = message.member) === null || _a === void 0 ? void 0 : _a.send("error al crear su perfil, comuniquese con un administrador");
                });
            }
            else {
                message.delete();
                (_m = message.member) === null || _m === void 0 ? void 0 : _m.send(`este usuario ya se encuentra registrado si desea cambiar el nombre, por favor contactar un administrador `);
            }
        }
        // SHOW BALANCE
        if (message.content.startsWith('.b')) {
            let user = message.member;
            balanceController.getHours(message, user);
        }
    }
}));
client.on('messageReactionAdd', (reaction, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _o;
    if (reaction.emoji.name === '👍') {
        if ((user.username) && (user.username !== "Assistence")) {
            let guildmember = (_o = reaction.message.guild) === null || _o === void 0 ? void 0 : _o.members.cache.find(member => member.user === user);
            let nickname = guildmember === null || guildmember === void 0 ? void 0 : guildmember.displayName;
            let hour = moment().tz('America/Argentina/Buenos_Aires').format('D/M/YYYY HH:mm');
            reaction.message.channel.messages.fetch({ around: reaction.message.id, limit: 1 })
                .then(msg => {
                let fetchedMsg = msg.first();
                let embedmessage = fetchedMsg === null || fetchedMsg === void 0 ? void 0 : fetchedMsg.embeds[0];
                // GROUP ROLL REACTIONS!
                if (embedmessage && reaction.emoji.name === "👍") {
                    let userField = embedmessage.fields.find(e => e.name === nickname);
                    if (!userField) {
                        Pilot_1.default.findOne({ userName: nickname }).then(pilot => {
                            console.log(hour);
                            pilot.newEntry = hour;
                            pilot === null || pilot === void 0 ? void 0 : pilot.save();
                            embedmessage.fields.push({ name: nickname, value: "desde   " + moment().tz('America/Argentina/Buenos_Aires').format('D/M/YYYY HH:mm') + "hs", inline: false, });
                            reaction.message.edit(embedmessage);
                        })
                            .catch(err => console.log(err));
                    }
                } // GROUP ROLL REACTIONS END
            });
        }
    }
    if (reaction.partial) {
        try {
            yield reaction.fetch();
        }
        catch (error) {
            console.log('Something went wrong when fetching the message: ', error);
            // Return as `reaction.message.author` may be undefined/null
            return;
        }
    }
    // Now the message has been cached and is fully available
    //	console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);
    // The reaction is now also fully available and the properties will be reflected accurately:
    //	console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
}));
client.on('messageReactionRemove', (reaction, user) => {
    var _a;
    var registroChannel = reaction.message.guild.channels.cache.find(x => x.id === "776628647548551169");
    let member = (_a = reaction.message.guild) === null || _a === void 0 ? void 0 : _a.members.cache.find(usuario => usuario.user === user);
    let nickname = member.displayName;
    if (member) {
        reaction.message.channel.messages.fetch({ around: reaction.message.id, limit: 1 })
            .then(msg => {
            let fetchedMsg = msg.first();
            let embedmessage = fetchedMsg === null || fetchedMsg === void 0 ? void 0 : fetchedMsg.embeds[0];
            if (embedmessage) {
                let buscar = embedmessage.fields.findIndex((field) => field.name === member.displayName);
                if (buscar > 0) {
                    Pilot_1.default.findOne({ userName: nickname }).then(pilot => {
                        let actualhour = moment().tz('America/Argentina/Buenos_Aires').format('D/M/YYYY HH:mm');
                        let entry = pilot === null || pilot === void 0 ? void 0 : pilot.newEntry;
                        var actualMoment = moment(actualhour, 'D/M/YYYY HH:mm');
                        var entryMoment = moment(entry, 'D/M/YYYY HH:mm');
                        let totaldone = actualMoment.diff(entryMoment, 'minutes');
                        console.log(actualMoment, entryMoment);
                        pilot.minutes = (pilot.minutes + totaldone);
                        registroChannel.send("Piloto:" + `${member}` + "\n hora de entrada: " + (pilot === null || pilot === void 0 ? void 0 : pilot.newEntry) +
                            "\n hora de salida: " + actualhour + "\n horas realizadas: " + balanceController.minToHours(totaldone) + "\n total de horas: " + balanceController.minToHours(pilot === null || pilot === void 0 ? void 0 : pilot.minutes) +
                            "\n .............................................");
                        embedmessage.fields.splice(buscar, 1);
                        reaction.message.edit(embedmessage);
                        pilot.newEntry = "";
                        pilot === null || pilot === void 0 ? void 0 : pilot.save();
                    })
                        .catch(err => console.log(err));
                }
            }
        });
    }
});
client.login(process.env.TOKEN);
// if (message.content.startsWith(`${prefix}`)) {
//   let mensaje = message.content.split('/')
//   let discordUser = message.member
//   region= mensaje[4];
//   server= mensaje[5];
//   name = mensaje[6];
//   
//   let role2500 = message.guild.roles.find(r => r.name === "2500+");
//   let role2750 = message.guild.roles.find(r => r.name === "2750+");
//   let role2900 = message.guild.roles.find(r => r.name === "2900+");
//   let role3000 = message.guild.roles.find(r => r.name === "3000+");
//   let role3200 = message.guild.roles.find(r => r.name === "3200+");
//   let role3400 = message.guild.roles.find(r => r.name === "3400+");
//   axios.get('https://raider.io/api/v1/characters/profile?region='+region+'&realm='+server+'&name='+name+'&fields=mythic_plus_scores_by_season%3Acurrent')
//   .then((response: any) => {
//     console.log(response.data.mythic_plus_scores_by_season[0].scores.all);
//     let score = response.data.mythic_plus_scores_by_season[0].scores.all
//     if ((score > 2000) && (score < 2500)) { 
//       discordUser.addRole(role2000);
//       discordUser.removeRole(role2500)
//       discordUser.removeRole(role2750)
//       discordUser.removeRole(role2900)
//       discordUser.removeRole(role3000)
//       discordUser.removeRole(role3200)
//       discordUser.removeRole(role3400)
//       message.channel.send( discordUser +" Rango actualizado correctamente. Score actual "+ score + ", rango asignado -> 2000+");
//     }
//     if ((score >= 2500) && (score < 2750)) { 
//       discordUser.addRole(role2500);
//       discordUser.removeRole(role2000)
//       discordUser.removeRole(role2750)
//       discordUser.removeRole(role2900)
//       discordUser.removeRole(role3000)
//       discordUser.removeRole(role3200)
//       discordUser.removeRole(role3400)
//       message.channel.send( discordUser +" Rango actualizado correctamente. Score actual "+ score + ", rango asignado -> 2500+");
//     }
//     if ((score >= 2750) && (score < 2900)) { 
//       discordUser.addRole(role2750);
//       discordUser.removeRole(role2000)
//       discordUser.removeRole(role2500)
//       discordUser.removeRole(role2900)
//       discordUser.removeRole(role3000)
//       discordUser.removeRole(role3200)
//       discordUser.removeRole(role3400)
//       message.channel.send( discordUser +" Rango actualizado correctamente. Score actual "+ score + ", rango asignado -> 2750+");
//     }
//     if ((score >= 2900) && (score < 3000)) { 
//       discordUser.addRole(role2900);
//       discordUser.removeRole(role2000)
//       discordUser.removeRole(role2500)
//       discordUser.removeRole(role2750)
//       discordUser.removeRole(role3000)
//       discordUser.removeRole(role3200)
//       discordUser.removeRole(role3400)
//       message.channel.send( discordUser +" Rango actualizado correctamente. Score actual "+ score + ", rango asignado -> 2900+");
//     }
//     if ((score >= 3000) && (score < 3200)) { 
//       discordUser.addRole(role3000);
//       discordUser.removeRole(role2000)
//       discordUser.removeRole(role2500)
//       discordUser.removeRole(role2750)
//       discordUser.removeRole(role2900)
//       discordUser.removeRole(role3200)
//       discordUser.removeRole(role3400)
//       message.channel.send( discordUser +" Rango actualizado correctamente. Score actual "+ score + ", rango asignado -> 3000+");
//     }
//     if ((score > 3200) && (score < 3400)) { 
//       discordUser.addRole(role3200);
//       discordUser.removeRole(role2000)
//       discordUser.removeRole(role2500)
//       discordUser.removeRole(role2750)
//       discordUser.removeRole(role2900)
//       discordUser.removeRole(role3000)
//       discordUser.removeRole(role3400)
//       message.channel.send( discordUser +" Rango actualizado correctamente. Score actual "+ score + ", rango asignado -> 3200+");
//     }
//     if (score >= 3400)  { 
//       discordUser.addRole(role3400);
//       discordUser.removeRole(role2000)
//       discordUser.removeRole(role2500)
//       discordUser.removeRole(role2750)
//       discordUser.removeRole(role2900)
//       discordUser.removeRole(role3000)
//       discordUser.removeRole(role3200)
//       message.channel.send( discordUser +" Rango actualizado correctamente. Score actual "+ score + ", rango asignado -> 3400+");
//     }
//   })
//   .catch(error => {
//     console.log(error);
//   });
//   message.delete()
// }
