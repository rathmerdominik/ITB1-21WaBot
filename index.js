/**
 * For now this Bot is just intended to read out the Root directory for Filebrowser and then Send it over to the Whatsapp Group.
 */

import { MessageType, Mimetype, WAConnection } from '@adiwajshing/baileys'
import * as fs from 'fs'
import * as chokidar from 'chokidar'
import { exit } from 'process'

if(!process.env.WABOT_CREDSPATH) throw Error("Set the WABOT_CREDSPATH environment variable!") 
if(!process.env.WABOT_ADMINNUMBER) throw Error("Set the WABOT_ADMINNUMBER environment variable!")
if(!process.env.WABOT_FILEROOT) throw Error("Set the WABOT_FILEROOT environment variable!")
if(!process.env.WABOT_GROUPTOSEND) throw Error("Set the WABOT_GROUPTOSEND environment variable!")
if(!process.env.WABOT_ATTACHURL) throw Error("Set the WABOT_ATTACHURL environment variable!")
if(!process.env.WABOT_SPLITBYUSER) throw Error("Set the WABOT_SPLITBYUSER environment variable!")

const splitByUser = process.env.WABOT_SPLITBYUSER
const groupToSend = process.env.WABOT_GROUPTOSEND
const credsPath = process.env.WABOT_CREDSPATH
const adminNumber = process.env.WABOT_ADMINNUMBER
const fileRoot = process.env.WABOT_FILEROOT
const attachURL = process.env.WABOT_ATTACHURL

const conn = new WAConnection() 
//set usable adminNumber
const realAdmin = adminNumber + "@s.whatsapp.net"

//check if credentials exist
fs.stat(credsPath + "/creds.json", (err) => { //check for Credentials
    if(err){
        console.log(err)
        return
    } else {
       
        //Load the current credentials
        conn.loadAuthInfo (credsPath + '/creds.json')
        return
    }
})

conn.on('open', () => {

            const authInfo = conn.base64EncodedAuthInfo()
            fs.writeFileSync(credsPath + '/creds.json', JSON.stringify(authInfo, null, '\t'))
            var watcher = chokidar.watch(fileRoot, {ignored: /^\./, persistent: true, ignoreInitial: true});
            watcher
            .on('ready', function(path) {
                conn.sendMessage(
                    groupToSend, 
                    "Monitoring for new Files!",
                    MessageType.text)
            })
            .on('add', function(path) {
                const basePath = path.split(splitByUser)
                const genURL = attachURL + basePath[1]
                const realURL = genURL.replace(' ', "%20")
                
                conn.sendMessage(
                    groupToSend, 
                    "Neue Datei wurde hochgeladen! \n" + realURL,
                    MessageType.text)
            })
            .on('error', function(error) {console.error('Error happened', error);})
})

conn.on('chat-update', async chat => { 

    if (!chat.hasNewMessage) {
        return
    } 

    const m = chat.messages.all()[0]

    if(m.key.fromMe){
        return
    }
    if(!m.message) return

    const conv = m.message.conversation
    const chatNumber = m.key.remoteJid

    if(chat.messages && chat.count){
        switch(conv){
            case "$suicide":
                if(m.participant !== realAdmin) return
                await conn.sendMessage(m.key.remoteJid, "Killing myself, Goodbye!", MessageType.text)
                conn.close()
                break;
        }
    }
})

//be the gigachad
conn.on('group-participants-update', async group => {
    
    const mygroup = group.jid
    if(group.action === "add"){
        if(mygroup !== groupToSend){
            await conn.sendMessage(
                group.jid, 
                fs.readFileSync("./media/gigachad.jpg"),
                MessageType.image,
                    {
                        mimetype: Mimetype.jpeg, 
                        caption: "> gets added to group\n> tells everyone to fuck off \n> refuses to elaborate \n> leaves"
                    }
                )
            await conn.groupLeave(group.jid)
        }
    }

})

conn.on('close', ({reason, isReconnecting}) => {
    if(reason === "intentional"){
        console.log("Successfully killed myself! Goodbye")
        exit(0)
    } else {
        console.log("Oh shit. I died cuz of "+ reason +"! Do i reconnect? " + isReconnecting)
    }
})
await conn.connect() 

