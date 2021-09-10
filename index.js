/**
 * For now this Bot is just intended to read out the Root directory for Filebrowser
 * and then Send it over to the Whatsapp Group.
 */

import { argv, exit } from 'process';
import { stat, readFileSync } from 'fs';
import YAML from 'yaml';
import { WAConnection } from '@adiwajshing/baileys';


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

// check if credentials exist
stat(`${credsPath}/creds.json`, (err) => { // check for Credentials
  if (err) console.error(err);
  else conn.loadAuthInfo(`${credsPath}/creds.json`);
});

Promise.all([
  import('./src/events/open'),
  import('./src/events/chat-update'),
  import('./src/events/group-participants-update'),
  import('./src/events/close')
])
  .then(modules => modules.forEach(m => m(conn)))
  .then(() => {
    // connect the bot and set the WaWEB version
    conn.connect();
    conn.version = [2, 2134, 9];
  })