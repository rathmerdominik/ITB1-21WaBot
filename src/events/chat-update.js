export default (conn) => conn.on('chat-update', async (chat) => {
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
        default:
          break;
      }
    }
});