/**
 * For now this Bot is just intended to read out the Root directory for Filebrowser
 * and then Send it over to the Whatsapp Group.
 */

import { MessageType, Mimetype, WAConnection } from '@adiwajshing/baileys';
import { exit } from 'process';
import { stat, readFileSync, writeFileSync } from 'fs';
import chokidar from 'chokidar';
import YAML from 'yaml';

let configFile;
if (process.env.WABOT_YMLCONF) {
  configFile = readFileSync(`${process.env.WABOT_YMLCONF}/config.yml`, 'utf8');
} else {
  configFile = readFileSync('./config.yml', 'utf-8');
}
const parsedData = YAML.parse(configFile);
console.log(parsedData);
const {
  credspath: credsPath,
  adminnumber: adminNumber,
  fileroot: fileRoot,
  grouptosend: groupToSend,
  attachurl: attachURL,
  splitbyuser: splitByUser,
} = parsedData;

const conn = new WAConnection();
// set usable adminNumber
const realAdmin = `${adminNumber}@s.whatsapp.net`;

const debounce = (fn, ms = 0) => {
  let timeoutId;
  return function timer(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

// check if credentials exist
stat(`${credsPath}/creds.json`, (err) => { // check for Credentials
  if (err) console.error(err);
  else conn.loadAuthInfo(`${credsPath}/creds.json`);
});

conn.on('open', () => {
  let files = [];
  const authInfo = conn.base64EncodedAuthInfo();

  const send = debounce(() => {
    if (files.length === 1) {
      conn.sendMessage(
        groupToSend,
        `Neue Datei wurde hochgeladen! \n${files[0]}`,
        MessageType.text,
      );
    } else {
      let batch = '';
      files.forEach((file) => {
        batch += `${file}\n\n`;
      });

      conn.sendMessage(
        groupToSend,
        `Batch upload! \n${batch}`,
        MessageType.text,
      );
    }
    files = [];
  }, 200);

  writeFileSync(`${credsPath}/creds.json`, JSON.stringify(authInfo, null, '\t'));
  const watcher = chokidar.watch(fileRoot, {
    ignored: /^\./,
    persistent: true,
    ignoreInitial: true,
    usePolling: true,
    awaitWriteFinish: {
      stabilityThreshold: 2000,
      pollInterval: 100,
    },
  });

  watcher
    .on('add', (path) => {
      const basePath = path.split(splitByUser);
      const genURL = encodeURI(attachURL + basePath[1]);
      console.log(genURL);
      files.push(genURL);
      send();
    })
    .on('error', (error) => console.error('Error happened', error));
});

conn.on('chat-update', async (chat) => {
  if (!chat.hasNewMessage) return;

  const m = chat.messages.all()[0];

  if (!m.message || m.key.fromMe) return;

  const conv = m.message.conversation;
  const chatNumber = m.key.remoteJid;

  if (chat.messages && chat.count) {
    switch (conv) {
      case '$suicide':

        if (m.participant !== realAdmin) return;
        await conn.sendMessage(chatNumber, 'Killing myself, Goodbye!', MessageType.text);
        conn.close();
        break;
      case '$meGithub':
        await conn.sendMessage(chatNumber, 'https://github.com/rathmerdominik/ITB1-21WaBot', MessageType.text);
        break;
      case '$ping':
        await conn.sendMessage(chatNumber, 'pong', MessageType.text);
        break;
      default:
        break;
    }
  }
});

// be the gigachad
conn.on('group-participants-update', async (group) => {
  const myGroup = group.jid;
  if (group.action === 'add' && myGroup !== groupToSend) {
    await conn.sendMessage(
      group.jid,
      readFileSync('./assets/images/gigachad.jpg'),
      MessageType.image,
      {
        mimetype: Mimetype.jpeg,
        caption: '> gets added to group\n> tells everyone to fuck off \n> refuses to elaborate \n> leaves',
      },
    );
  }
  await conn.groupLeave(group.jid);
});

conn.on('close', ({ reason, isReconnecting }) => {
  if (reason === 'intentional') {
    console.info('Successfully killed myself! Goodbye');
    exit(0);
  } else console.error(`Oh shit. I died cuz of ${reason}! Do i reconnect? ${isReconnecting}`);
});
conn.connect();
conn.version = [2, 2134, 9];
