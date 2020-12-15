import { config } from "dotenv";
config();
import { Client, Message, TextChannel, MessageEmbed, MessageReaction, GuildMember } from "discord.js";
const Discord = require('discord.js');
import { prefix } from "./config.json";
import axios from 'axios';
import { ProcessEnvOptions } from "child_process";
import { Z_ASCII } from "zlib";
import  * as embeds from './Embeds'
import * as roll from './roll.controller'
import * as db from './mongodb'
import Balance from './models/balance'
import balance from "./models/balance";
import * as balanceController from "./balance.controller";
import Pilot from "./models/Pilot";

var moment = require('moment-timezone');
moment().tz("America/Argentina/Buenos_Aires").format();
const GphApiClient = require("giphy-js-sdk-core");
const { GIPHY_TOKEN } = process.env;
const personaje = []
const client: Client = new Client();
const giphy = GphApiClient(GIPHY_TOKEN);
const discordavatar = "https://media1.tenor.com/images/54cc77830f82ef67471d8d868d09ad2f/tenor.gif?itemid=11230336"
let index = 0;
let emb = "embed"
const erroravatar = "https://i.pinimg.com/originals/4c/22/18/4c2218f5cc96ba76c0e590cd1dadb1bc.gif"


client.once("ready", () => {
  console.log("Bot is ready!");
  db.startConnecion();

});
client.on('guildMemberAdd',  ( member) => {
  let newrole =  member.guild.roles.cache.find(r => r.name === "New");
  let welcomeChanel = member.guild.channels.cache.find(x => x.id === "723311059200639047") as TextChannel
  member.roles.add(newrole!)

 });

client.on("message", async (message: Message) => {
  if ( message.guild){
  let bolsaChannel = message.guild.channels.cache.find(x => x.id === "723311059200639047") as TextChannel
  let gamblingChannel = message.guild.channels.cache.find(x => x.id === "760602851444523028") as TextChannel
    let discordUser = message.member
    var regex = /(\d+)/g;
    let aPagar = 0;
    let bolsaActual = 0;
    
    // GROUP ROLL 
    if (message.content.startsWith('.gr')){
   let embedmessage = embeds.gr
   embedmessage.setTitle("en servicio " )
   message.channel.send(embedmessage).then(function (message) {
    message.react("👍")
  }).catch(function() {
  
   });

    }
    
       //set balance
    if (message.content.startsWith('.setbalance')){
      if(message.channel.id === "765095046101598208"){
      let member = message.member!
      let admin =  member.guild.roles.cache.find(r => r.name === "admin")!;
      let goldColector =  member.guild.roles.cache.find(r => r.name === "Gold collector")!
      let newbalance = parseInt( message.content.match(regex)?.pop()?.toString()!)
      if (member.roles.cache.has(admin.id) || member.roles.cache.has(goldColector.id)  ){
       let user = message.mentions.members?.first()!
       Balance.findOneAndUpdate( { userName : user.displayName}, {balance : newbalance }).then(
        balance => { 
         message.channel.send(`${member} actualiza el balance de ${user} nuevo balance: ${newbalance}`)
      })
      .catch(err => console.log(err))
    }
  }
   }
  

if (message.content.startsWith('.addhours')){
  if(message.channel.id === "776638753548271626"){
  let member = message.member!
  let admin =  member.guild.roles.cache.find(r => r.name === "admin")!;
  let goldColector =  member.guild.roles.cache.find(r => r.name === "Gold collector")!
  let newhours = parseInt( message.content.match(regex)?.pop()?.toString()!)
  var hour = 0
  var minutes= 0
  var newhours2 = message.content.split(' ').pop()!
  console.log("nuevahora" +newhours2)
  if (newhours2.search(":") > -1 ){
   hour = parseInt( newhours2.split(":")[0])
   minutes =  parseInt(newhours2.split(":")[1])
   console.log(hour , minutes)
  }
  if (member.roles.cache.has(admin.id) || member.roles.cache.has(goldColector.id)  ){
   let user = message.mentions.members?.first()!
   let userBalance =  await Pilot.findOne({ userName: user.displayName})
  if((hour && minutes) ||  (hour && minutes === 0) || (minutes && hour === 0)){ 
  if(userBalance && (hour > 0 || minutes > 0)){
    let totalminutes = hour*60 + minutes
      userBalance.minutes = userBalance.minutes + totalminutes
      userBalance.save().then(async succes => {
      message.channel.send(`${member} agrega ${balanceController.minToHours(totalminutes)} horas a ${user}`)
     let balanceckeck  = await message.channel.send(`.b ${user}`)
     balanceckeck.delete()
     }).catch(err => console.log(err))
      } 
   }else{
    message.channel.send("error en el formato use .addhours @nombre hh:mm")
  }}
   //// format hh:mm
  
  }
}

if (message.content.startsWith('.subhours')){
  if(message.channel.id === "776638753548271626"){
    let member = message.member!
    let admin =  member.guild.roles.cache.find(r => r.name === "admin")!;
    let goldColector =  member.guild.roles.cache.find(r => r.name === "Gold collector")!
    let newhours = parseInt( message.content.match(regex)?.pop()?.toString()!)
    var hour = 0
    var minutes= 0
    var newhours2 = message.content.split(' ').pop()!
    console.log("nuevahora" +newhours2)
    if (newhours2.search(":") > -1 ){
     hour = parseInt( newhours2.split(":")[0])
     minutes =  parseInt(newhours2.split(":")[1])
     console.log(hour , minutes)
    }
    if (member.roles.cache.has(admin.id) || member.roles.cache.has(goldColector.id)  ){
     let user = message.mentions.members?.first()!
     let userBalance =  await Pilot.findOne({ userName: user.displayName})
    if((hour && minutes) ||  (hour && minutes === 0) || (minutes && hour === 0) ){ 
    if(userBalance && (hour > 0 || minutes > 0)){
      let totalminutes = hour*60 + minutes
        userBalance.minutes = userBalance.minutes - totalminutes
        userBalance.save().then(async succes => {
        message.channel.send(`${member} le resta ${balanceController.minToHours(totalminutes)} horas a ${user}`)
       let balanceckeck  = await message.channel.send(`.b ${user}`)
       balanceckeck.delete()
       }).catch(err => console.log(err))
        } 
     }else{
      message.channel.send("error en el formato use .subhours @nombre hh:mm")
    }}
     //// format hh:mm
    
    }
}
   // add pilot
if (message.content.startsWith('.alta')) {

   let name = message.mentions.members?.first()?.displayName!
   let exist = await Pilot.findOne({userName: name})
   if(!exist){ 
   let newPilot = {
     userName: name,
     minutes: 0,
     newEntry: "",
    
    }
   let pilot= new Pilot(newPilot)
   pilot.save().then( succes => {
     message.channel.send("se ha agregado un nuevo piloto: "+ pilot.userName)
   let aereomanco = message.guild!.roles.cache.find(r => r.name === "AEREOMANCO");
    message.member?.setNickname(name) 
    message.member?.roles.add(aereomanco!)
    message.delete()
   
   })
   .catch(err => {
     console.log(err) 
     message.member?.send("error al crear su perfil, comuniquese con un administrador")
   })
   } else{ 
     message.delete()
     message.member?.send(`este usuario ya se encuentra registrado si desea cambiar el nombre, por favor contactar un administrador `)
   }
     }


         // SHOW BALANCE
    if (message.content.startsWith('.b')){
    let  user = message.member!
    balanceController.getHours(message, user)
   }
} 
});
 client.on('messageReactionAdd', async (reaction, user) => {
  if (reaction.emoji.name === '👍'){
  if ((user.username) && (user.username !== "Assistence") ){
    let guildmember =  reaction.message.guild?.members.cache.find(member => member.user === user )
    let nickname = guildmember?.displayName
    let hour = moment().tz('America/Argentina/Buenos_Aires').format('D/M/YYYY HH:mm');
    reaction.message.channel.messages.fetch({around: reaction.message.id, limit: 1})
    .then(msg => {
        let fetchedMsg = msg.first();
        let embedmessage = fetchedMsg?.embeds[0]
                    // GROUP ROLL REACTIONS!
        if (embedmessage  && reaction.emoji.name === "👍"){ 
          let userField = embedmessage.fields.find(e => e.name === nickname)
          if ( !userField){ 
            Pilot.findOne( { userName : nickname}).then(
              pilot => {  
                console.log(hour)
                pilot!.newEntry = hour
                pilot?.save()
          embedmessage!.fields.push({name: nickname!, value: "desde   " + moment().tz('America/Argentina/Buenos_Aires').format('D/M/YYYY HH:mm') + "hs" , inline: false, })
          reaction.message.edit(embedmessage)
            }) 
          .catch( err => console.log(err))
          }}// GROUP ROLL REACTIONS END
  
    } )
  }
      }
               

	if (reaction.partial) {
  
		try {
			await reaction.fetch();
		} catch (error) {
			console.log('Something went wrong when fetching the message: ', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}
	// Now the message has been cached and is fully available
//	console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);
	// The reaction is now also fully available and the properties will be reflected accurately:
//	console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
});

client.on('messageReactionRemove', (reaction, user) => {
  var registroChannel = reaction.message.guild!.channels.cache.find(x => x.id === "776628647548551169") as TextChannel
  let member = reaction.message.guild?.members.cache.find(usuario => usuario.user === user)!
  let nickname = member.displayName
  if (member) {
    reaction.message.channel.messages.fetch({around: reaction.message.id, limit: 1})
    .then(msg => {
        let fetchedMsg = msg.first();
        let embedmessage = fetchedMsg?.embeds[0]
        if (embedmessage  ){ 
          let buscar = embedmessage.fields.findIndex((field : any) => field.name === member.displayName);
          if(buscar > 0){
            Pilot.findOne( { userName : nickname}).then(
              pilot => {  
          let actualhour = moment().tz('America/Argentina/Buenos_Aires').format('D/M/YYYY HH:mm')
          let entry= pilot?.newEntry
          var actualMoment = moment(actualhour, 'D/M/YYYY HH:mm')
          var entryMoment = moment(entry, 'D/M/YYYY HH:mm')
          let totaldone = actualMoment.diff(entryMoment, 'minutes')
          console.log(actualMoment, entryMoment)
          pilot!.minutes = (pilot!.minutes + totaldone)
          registroChannel.send("Piloto:" + `${member}` + "\n hora de entrada: " + pilot?.newEntry +
          "\n hora de salida: " + actualhour + "\n horas realizadas: "+ balanceController.minToHours(totaldone)  + "\n total de horas: " + balanceController.minToHours(pilot?.minutes!) +
          "\n ............................................." )
          embedmessage!.fields.splice(buscar, 1);
          reaction.message.edit(embedmessage)
          pilot!.newEntry = ""
          pilot?.save()
            })
          .catch(err => console.log(err)) }
        } 
    });
     }
}

);



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