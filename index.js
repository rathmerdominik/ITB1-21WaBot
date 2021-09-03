/**
 * For now this Bot is just intended to read out the Root directory for Filebrowser and then Send it over to the Whatsapp Group.
 */

import { MessageType, Mimetype, WAConnection } from '@adiwajshing/baileys'
import { exit } from 'process'
import { stat, writeFileSync } from 'fs'
import * as chokidar from 'chokidar'

/* Probably not needed
if(!process.env.WABOT_CREDSPATH) throw Error("Set the WABOT_CREDSPATH environment variable!") 
if(!process.env.WABOT_ADMINNUMBER) throw Error("Set the WABOT_ADMINNUMBER environment variable!")
if(!process.env.WABOT_FILEROOT) throw Error("Set the WABOT_FILEROOT environment variable!")
if(!process.env.WABOT_GROUPTOSEND) throw Error("Set the WABOT_GROUPTOSEND environment variable!")
if(!process.env.WABOT_ATTACHURL) throw Error("Set the WABOT_ATTACHURL environment variable!")
if(!process.env.WABOT_SPLITBYUSER) throw Error("Set the WABOT_SPLITBYUSER environment variable!")
*/

const {
  WABOT_SPLITBYUSER: splitByUser,
  WABOT_GROUPTOSEND: groupToSend,
  WABOT_CREDSPATH: credsPath,
  WABOT_ADMINNUMBER: adminRoot,
  WABOT_FILEROOT: fileRoot,
  WABOT_ATTACHURL: attachURL,
} = process.env

const conn = new WAConnection()
//set usable adminNumber
const realAdmin = `${adminRoot}@s.whatsapp.net`

/**
 * @description Some descriptive description
 * @param fn Callback function
 * @param ms Delay
 * @returns void
 */
const debounce = (fn, ms = 0) => {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), ms)
  }
}

// Check if credentials exist
stat(`${credsPath}/creds.json`, (err) => {
  // Check for Credentials. If error, throw an exception
  if (err) throw new Error(err)
  else conn.loadAuthInfo(`${credsPath}creds.json`)
})

conn.on('open', () => {
  let files = []
  const authInfo = conn.base64EncodedAuthInfo()

  const send = debounce(() => {
    if (files.length === 1) conn.sendMessage(
        groupToSend,
        'Neue Datei wurde hochgeladen! \n' + files[0],
        MessageType.text);
    else {
      let batch = ''
      files.forEach((file) => {
        batch += file + '\n' + '\n'
      })

      conn.sendMessage(
        groupToSend,
        'Batch upload! \n' + batch,
        MessageType.text
      )
    }
    files = []
  }, 200)

  writeFileSync(`${credsPath}/creds.json`, JSON.stringify(authInfo, null, '\t'))
  const watcher = chokidar.watch(fileRoot, {
    ignored: /^\./,
    persistent: true,
    ignoreInitial: true,
    usePolling: true,
    awaitWriteFinish: {
      stabilityThreshold: 2000,
      pollInterval: 100,
    },
  })

  watcher
    .on('ready', () => {
      conn.sendMessage(
        groupToSend,
        'Monitoring for new Files!',
        MessageType.text
      )
    })
    .on('add', (path, _stats) => {
      const basePath = path.split(splitByUser)
      const genURL = attachURL + basePath[1]
      const realURL = genURL.replace(' ', '%20')

      files.push(realURL)
      send()
    })
    .on('error', (err) => {
        throw new Error(err)
    })
})

conn.on('chat-update', async (chat) => {
  if (!chat.hasNewMessage) return

  const m = chat.messages.all()[0]

  if (!m.message || m.key.fromMe) return

  const conv = m.message.conversation
  const chatNumber = m.key.remoteJid

  if (chat.messages && chat.count) {
    switch (conv) {
      case '$suicide': 
        if (m.participant !== realAdmin) return

        await conn.sendMessage(
          m.key.remoteJid,
          'Killing myself, Goodbye!',
          MessageType.text
        )
        conn.close()
        break

      case '$meGithub':
        await conn.sendMessage(
          m.key.remoteJid,
          'https://github.com/rathmerdominik/ITB1-21WaBot',
          MessageType.text
        )
        break

      case '$ping':
        await conn.sendMessage(m.key.remoteJid, 'pong', MessageType.text)
        break
    }
  }
})

//be the gigachad
conn.on('group-participants-update', async (group) => {
  console.log(group.jid)
  const myGroup = group.jid
  if (group.action === 'add' && myGroup !== groupToSend)
    await conn.sendMessage(
      group.jid,
      fs.readFileSync('./media/gigachad.jpg'),
      MessageType.image,
      {
        mimetype: Mimetype.jpeg,
        caption:
          '> gets added to group\n> tells everyone to fuck off \n> refuses to elaborate \n> leaves',
      }
    )
  await conn.groupLeave(group.jid)
})

conn.on('close', ({ reason, isReconnecting }) => {
  if (reason === 'intentional') {
    console.log('Successfully killed myself! Goodbye')
    exit(0)
  } else
    console.log(
      'Oh shit. I died cuz of ' + reason + '! Do i reconnect? ' + isReconnecting
    )
})

await conn.connect()

// What is this ?
conn.version = [2, 2134, 9]
