import { Client, Message, TextChannel, MessageEmbed, EmbedField } from "discord.js";
const Discord = require('discord.js');



  export const gr = new Discord.MessageEmbed()
	.setColor('#0x0099ff')
	.setTitle('Pilotos en Servicio')
	.setAuthor('NariBot', 'https://4.bp.blogspot.com/-VcJ24XFJwcs/UKRCdrgXB1I/AAAAAAAAAl0/KuAsd-aY8vc/s320/Foto%2B1.jpg', 'https://discord.js.org')
	.setThumbnail('https://media2.giphy.com/media/J4yNRingyayMMIapTH/200.gif')
	.addFields(
		{ name: '------------------------------------------------------------',
        value: '-------------------------------------------------------------',
        inline: false },
	)
	.setTimestamp()
	.setFooter('reacciona para entrar o salir de servicio');




	export const roll = new Discord.MessageEmbed()
	.setColor('#0x0099ff')
	.setTitle('1vs1 roll')
	.setAuthor('NariBot', 'https://4.bp.blogspot.com/-VcJ24XFJwcs/UKRCdrgXB1I/AAAAAAAAAl0/KuAsd-aY8vc/s320/Foto%2B1.jpg', 'https://discord.js.org')
	.setDescription('tiene 20 sg para aceptar el reto')
	.setThumbnail('https://media.tenor.com/images/6b5c1dd76c2a7ac8cad04ac4e10353b3/tenor.gif')
	.setTimestamp()
	.setFooter('reacciona para aceptar el reto!');


	export const fieldTitle: EmbedField = { 
		name: 'el roll mas bajo pagara la diferencia al roll mas alto:',
		value: '-------------------------------------------------------------',
		inline: false

	}

	export const balaceCheck = new Discord.MessageEmbed()
	.setColor('#0x0099ff')

	
	export const dr = new Discord.MessageEmbed()
	.setColor('#0x0099ff')
	.setAuthor('NariBot', 'https://4.bp.blogspot.com/-VcJ24XFJwcs/UKRCdrgXB1I/AAAAAAAAAl0/KuAsd-aY8vc/s320/Foto%2B1.jpg', 'https://discord.js.org')
	.setThumbnail('https://media.tenor.com/images/6b5c1dd76c2a7ac8cad04ac4e10353b3/tenor.gif')
	.setTimestamp()
	.setFooter('reacciona para aceptar el reto!');


	export const nari = new MessageEmbed()
	.setColor('#0x0099ff')
	.setAuthor('NariBot', 'https://4.bp.blogspot.com/-VcJ24XFJwcs/UKRCdrgXB1I/AAAAAAAAAl0/KuAsd-aY8vc/s320/Foto%2B1.jpg', 'https://discord.js.org')
	.setThumbnail('https://media.tenor.com/images/6b5c1dd76c2a7ac8cad04ac4e10353b3/tenor.gif')
	.setTimestamp()
	.setFooter('reacciona tu eleccion!');
	