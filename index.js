/**
 * For now this Bot is just intended to read out the Root directory for Filebrowser
 * and then Send it over to the Whatsapp Group.
 */

import { MessageType, Mimetype, WAConnection } from '@adiwajshing/baileys';
import { argv, exit } from 'process';
import { stat, readFileSync, writeFileSync } from 'fs';
import chokidar from 'chokidar';
import YAML from 'yaml';
import TimeTable from './timetable/timetable.js';

let testForGroup = false;
const realArgs = argv.slice(2);

// set the Bot in Group monitor mode
if (realArgs[0] === '--testForGroup') testForGroup = true;

// read content of the config file
const ymlConf = process.env.WABOT_YMLCONF
let configFile = readFileSync(
  ymlConf ? 
    `${ymlConf}/config.yml` : 
    './config.json', 
 'utf8')

const parsedData = YAML.parse(configFile);

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

/**
 * This function debounces another function
 *
 * @param fn function to be called after debounce time has been met
 * @param ms ms to debounce for
 */
const debounce = (fn, ms = 0) => {
  let timeoutId;
  return function (...args) {
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

  // Send the filepath to the group. This will also check for batchuploads
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

  // Write credentials
  writeFileSync(`${credsPath}/creds.json`, JSON.stringify(authInfo, null, '\t'));

  // add a watcher that monitors in the fileroot for new files
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

  // when a new file has been added then prepare the filepath for sending
  watcher
    .on('add', (path) => {
      let genURL = '';
      if (splitByUser) {
        // attach the url to the filepath to make a fully clickable direct link to the file
        const basePath = path.split(splitByUser);
        genURL = encodeURI(attachURL + basePath[1]);
      } else {
        genURL = encodeURI(attachURL + path);
      }

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

        if (m.participant !== realAdmin) return; // kill the bot when it gets called from the admin
        await conn.sendMessage(chatNumber, 'Killing myself, Goodbye!', MessageType.text);
        conn.close();
        break;
      case '$meGithub': // send the githublink of the bot
        await conn.sendMessage(chatNumber, 'https://github.com/rathmerdominik/ITB1-21WaBot', MessageType.text);
        break;
      case '$ping': // Bot still alive?
        await conn.sendMessage(chatNumber, 'pong', MessageType.text);
        break;
      case '$timeTable':
        await conn.sendMessage(chatNumber, TimeTable.getTimeTable(), MessageType.text);
        break;
      default:
        break;
    }
  }
});

/*
* be the gigachad. this will make the bot leave a group that is not specified in the 'grouptosend'
* config option. This will be ignore if the '--testForGroup' has been set.
*/
conn.on('group-participants-update', async (group) => {
  const myGroup = group.jid;

  if (group.action === 'add' && testForGroup) {
    await conn.sendMessage(
      group.jid,
      `Hey there, your Group id is: ${group.jid}`,
      MessageType.text,
    );
    console.info(group.jid);
    return;
  }

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

// specify what exactly happened on close
conn.on('close', ({ reason, isReconnecting }) => {
  if (reason === 'intentional') {
    console.info('Successfully killed myself! Goodbye');
    exit(0);
  } else console.error(`I have died with the following error: ${reason} ! Do i reconnect? ${isReconnecting}`);
});

// connect the bot and set the WaWEB version
conn.connect();
conn.version = [2, 2134, 9];
