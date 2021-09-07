# ITB1-21WaBot
Whatsapp Bot for the managment of the ITB1-21 Group

## Installation
To install this bot you need to do the following: 
```
git clone https://github.com/rathmerdominik/ITB1-21WaBot.git
cd ITB1-21WaBot
npm install github:adiwajshing/baileys chokidar node-schedule yaml
```

## Setting up the Whatsapp Environment

It is required that you have a phone with a seperate whatsapp instance that can stay online for the entire time while the bot is running.

Launch the Bot
```
node index.js
```
Scan the QR-Code appearing on your screen and put your phone in a location where it can stay and charge until you decide to shutdown the bot

## Customization

You can customize where the yml file is located. Set the ```WABOT_YMLCONF``` env variable for that
