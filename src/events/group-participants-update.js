import { MessageType, Mimetype } from '@adiwajshing/baileys';
import { readFileSync } from 'fs'

/*
* be the gigachad. this will make the bot leave a group that is not specified in the 'grouptosend'
* config option. This will be ignore if the '--testForGroup' has been set.
*/
export default (conn) => conn.on('group-participants-update', async (group) => {
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