# ITB1-21WaBot
Whatsapp Bot for the managment of the ITB1-21 Group

## Installation
To install this bot you need to do the following: 
```
git clone https://github.com/rathmerdominik/ITB1-21WaBot.git
cd ITB1-21WaBot
npm install github:adiwajshing/baileys chokidar
```

## Setting up the Environment Variables
You need to setup the following Environment variables 
```
WABOT_CREDSPATH=    //The folder where your Whatsapp credentials should be saved and read
WABOT_ADMINNUMBER=  //The number that is allowed to execute special commands from the bot  
WABOT_FILEROOT=     //The root folder of your Filebrowser instance
WABOT_GROUPTOSEND=  //The group where updates should be send
WABOT_ATTACHURL=    //The Url that should be attached to instantly link the new file
WABOT_SPLITBYUSER=  //The User from which the Changes should be read on 
```

## Setting up the Whatsapp Environment

It is required that you have a phone with a seperate whatsapp instance that can stay online for the entire time while the bot is running.

Launch the Bot
```
node index.js
```
Scan the QR-Code appearing on your screen and put your phone in a location where it can stay and charge until you decide to shutdown the bot
