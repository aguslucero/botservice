import { Client, Message, TextChannel, MessageEmbed, MessageReaction, EmbedField, User, GuildMember } from "discord.js";
import { cpuUsage } from "process";
import GroupRoll from './models/grouproll'
import * as embeds from './Embeds'
import Balance from './models/balance'
import Pilot from "./models/Pilot";



const comision = 0.99
const discordavatar = "https://media1.tenor.com/images/54cc77830f82ef67471d8d868d09ad2f/tenor.gif?itemid=11230336"
const regex = /(\d+)/g; 
const erroravatar = "https://i.pinimg.com/originals/4c/22/18/4c2218f5cc96ba76c0e590cd1dadb1bc.gif"

class CheckbalanceResponse { 
    
    canroll: boolean
    embedmessage: MessageEmbed

     constructor (canroll: boolean, embedmessage: MessageEmbed){
       this.canroll = canroll
       this.embedmessage = embedmessage
    }
   

}

export async function rollBalance (winner: string, losser: string, total: number) : Promise<boolean> { 
 let win =  await Balance.findOne({ userName: winner})
 let loser = await Balance.findOne({ userName: losser})
 let casino  = await Balance.findOne({ userName: "Urlinja-Ragnaros"})
  if (casino && win && loser && win.userName != loser.userName ) { 
  let newWinnerBalance = win.balance  - total  + (total * 2 * comision)  
  let newLosserBalance = loser.balance - total
  //casino stats beging
  casino.earned = casino.earned + (total * 2 * (1-comision))
  casino.rolls   = casino.rolls + 1 
  //casino stats end
  win.rolls = win.rolls +1 
  win.gambled = win.gambled + total
  win.earned = win.earned - total  + (total * 2 * comision)
  win.win = win.win +1 
  loser.rolls = loser.rolls + 1
  loser.gambled = loser.gambled + total
  loser.earned = loser.earned - total
  loser.lost = loser.lost +1
  win.balance = Math.floor(newWinnerBalance)
  loser.balance = Math.floor(newLosserBalance)
  try { 
  await loser.save()
  await win.save()
  await casino.save()
  return true 
 } catch(err) { 
     console.log(err)
     return false
 }} else {
     return false
 }
}

export async function rollBalance7 (winner: string, losser: string, total: number) : Promise<boolean> { 
    let win =  await Balance.findOne({ userName: winner})
    let loser = await Balance.findOne({ userName: losser})
    let casino  = await Balance.findOne({ userName: "Urlinja-Ragnaros"})
     if ( casino && win && loser && win.userName != loser.userName ) { 
     let newWinnerBalance = win.balance - total  + (total * 2 * comision) 
     let newLosserBalance = loser.balance - total 
     casino.earned = casino.earned + (total * 2 * (1-comision))
     casino.rolls   = casino.rolls + 1 
     win.rolls = win.rolls + 1 
     win.gambled = win.gambled + total
     win.earned = win.earned - total  + (total * 2 * comision) 
     win.win = win.win +1 
     loser.rolls = loser.rolls + 1
     loser.gambled = loser.gambled + total
     loser.earned = loser.earned - total
     loser.lost = loser.lost + 1
     if(loser.userName === "NariBot"){
      newWinnerBalance = win.balance - total + (total * 4 * comision )
      newLosserBalance = loser.balance- (total*3)
      win.earned = win.earned + ((total * 4 * comision ) - total)
      loser.earned = loser.earned - (total*3)
     }
     win.balance = Math.floor(newWinnerBalance)
     loser.balance = Math.floor(newLosserBalance)
     try { 
     await loser.save()
     await win.save()
     await casino.save()
     return true 
    } catch(err) { 
        console.log(err)
        return false
    }} else {
        return false
    }
   }

export function getBalance(message: Message , member: GuildMember) { 
    let mention = message.mentions.members?.first()
    let user = member
    if (mention){
        user = mention
    }
    Pilot.findOne( { userName : user.displayName}).then(
        pilot => { 
          console.log(pilot)
        let embedBalance: MessageEmbed = embeds.balaceCheck
        embedBalance.fields = []
        embedBalance.setDescription("")
        embedBalance.setAuthor(user.displayName, user.user.avatarURL() || discordavatar )
        embedBalance.addField("horas:", pilot?.minutes )
        message.channel.send(embedBalance)
        })
        .catch(err => console.log(err))
}


export function getStats(message: Message , member: GuildMember) { 
    let mention = message.mentions.members?.first()
    let user = member
    if (mention){
        user = mention
    }
    Balance.findOne( { userName : user.displayName}).then(
        balance => { 
        console.log(balance) 
        try { 
        if(balance?.rolls! > 0){ 
        let embedStats: MessageEmbed = embeds.balaceCheck
        embedStats.fields = []
        embedStats.setAuthor(user.displayName, user.user.avatarURL() || discordavatar )
        embedStats.addField("Rolls:        ", "🎲" + balance?.rolls, true )
        embedStats.addField("Total Ganado: ", Math.round(balance?.earned!) +" 💰", true )
        embedStats.addField("Total jugado: ", Math.round(balance?.gambled!) + " 💰", true )
        embedStats.addField("Rolls Ganados:", "🎲" + balance?.win, true )
        embedStats.addField("Rolls Perdidos :", "🎲" +balance?.lost, true )
        embedStats.addField("% de victorias :", Math.round((balance?.win! * 100) / balance?.rolls!) +"%" , true )
        
        message.channel.send(embedStats)
        }else {
            let embedStats: MessageEmbed = embeds.balaceCheck
            embedStats.fields = []
            embedStats.setAuthor(user.displayName, erroravatar )
            embedStats.setDescription("Primero debes hacer una apuesta")
            message.channel.send(embedStats)
        }
        } catch{ 
            let embedStats: MessageEmbed = embeds.balaceCheck
            embedStats.fields = []
            embedStats.setAuthor(user.displayName, erroravatar )
            embedStats.setDescription("Error al cargar las estadisticas")
            message.channel.send(embedStats)
        }
        })
        .catch(err => console.log(err))
}


export async function canRoll(message: Message, embedMessage: MessageEmbed, bet: number): Promise<boolean>{
    let canroll = true
    let allfields = embedMessage.fields
      for ( let field of allfields){
      let name = field.name
      let user =  await Balance.findOne({userName: name })
      if ( user?.balance! < bet ){  
          field.name = "❌" + field.name
          field.value = user?.balance!.toString()!
          console.log(field)
          embedMessage.setDescription("Cancelado, balance insuficiente")
          canroll = false
      } else {
         field.value = user?.balance!.toString()!
         }
        }
        if (canroll){ 
        embedMessage.setDescription('tiene 20 sg para aceptar el reto')
        }
        message.edit(embedMessage)  
     return canroll
  }

  export async function nariCanRoll(message: Message, embedMessage: MessageEmbed, bet: number): Promise<boolean>{
    let canroll = true
    let allfields = embedMessage.fields
      for ( let field of allfields){
      let name = field.name
      let user =  await Balance.findOne({userName: name })
      if ( user?.balance! < bet ){  
          field.name = "❌" + field.name
          field.value = user?.balance!.toString()!
          console.log(field)
          embedMessage.setDescription("Cancelado, balance insuficiente")
          canroll = false
      } else {
         field.value = user?.balance!.toString()!
         }
        }
        if (canroll){ 
        embedMessage.setDescription('esperando su eleccion')
        }
        message.edit(embedMessage)  
     return canroll
  }


  export async function canDr(message: Message, embedMessage: MessageEmbed, bet: number): Promise<boolean>{
    let canroll = true
    let allfields = embedMessage.fields
      for ( let field of allfields){
      let name = field.name
      let user =  await Balance.findOne({userName: name })
      if ( user?.balance! < bet ){  
          field.name = "❌" + field.name
          field.value = user?.balance!.toString()!
          console.log(field)
          embedMessage.setDescription("Cancelado, balance insuficiente")
          canroll = false
      } else {
         field.value = user?.balance!.toString()!
         }
        }
        if (canroll){ 
        embedMessage.setDescription('esperando aceptacion')
        }
        message.edit(embedMessage)  
     return canroll
  }
 

  // ----------------------------------- aeromancos -----------------//
  
  export function minToHours(min:number): String{
    let hours = Math.floor(min/ 60)
    let minutes = min - hours * 60
    var totalhours = hours +":"+ minutes
    if ( minutes < 10 ){
        totalhours = hours +":0"+ minutes
    }
    return  totalhours.toString()
  }

  export function getHours(message: Message , member: GuildMember) { 
    let mention = message.mentions.members?.first()
    let user = member
    if (mention){
        user = mention
    }
    Pilot.findOne( { userName : user.displayName}).then(
        pilot => { 
          console.log(pilot)
        let embedBalance: MessageEmbed = embeds.balaceCheck
        embedBalance.fields = []
        embedBalance.setDescription("")
        embedBalance.setAuthor(user.displayName, user.user.avatarURL() || discordavatar )
        let totalhours = minToHours(pilot!.minutes)
        embedBalance.addField("Total de horas:",  totalhours )
        message.channel.send(embedBalance)
        })
        .catch(err => console.log(err))
}
