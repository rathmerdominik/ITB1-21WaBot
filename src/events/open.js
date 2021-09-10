import debounce from '../debounce'
import chokidar from 'chokidar';
import { writeFileSync } from 'fs'

export default (conn) => conn.on('open', () => {
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