import { exit } from 'process';

// specify what exactly happened on close
export default (conn) => conn.on('close', ({ reason, isReconnecting }) => {
    if (reason === 'intentional') {
        console.info('Successfully killed myself! Goodbye');
        exit(0);
    } else console.error(`I have died with the following error: ${reason} ! Do i reconnect? ${isReconnecting}`);
});