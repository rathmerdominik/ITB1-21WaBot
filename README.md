# ITB1-21WaBot

Highly modular Whatsapp Bot originally meant for maintaining my School class.

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

## Setting up the config.yml

The `config.yml` file is the first thing you need to configure. The program is designed to be as customizable as possible.
Here is a full explaination what each of the variables mean:

```yml
credspath: /home/user/itbot                 //here you setup the path where the path wheer the whatsapp credentials are supposed to be stored
adminnumber: 491760000000                   //here you setup the number that is allowed to issue certain commands. Currently only $suicide is an adminnumber command
fileroot: /home/dominik/projects/itbot      //here you define where the bot should listen for new files
grouptosend: 49176000000-321312412@g.us     //here you define to which group the bot should send its information. See "Get your GroupID" for infos how to get this
attachurl: https://filebrowser.example.net  //here you define what URL the bot should attach when a new file has been added. The full path gets build from url + filepath
splitbyuser:
  ITB1-21                        //here you define for which user it should monitor files for.
  //This is intended to be used with filebrowser.io. You can leave this empty to monitor for everything inside a directory
```

## Get your GroupID

To get the ID that is needed to set the `grouptosend` variable inside the `config.yml` you can start your program with the `--testForGroup` option.
With this option enabled it will send the Whatsapp ID in your console AND in the group you added the bot.
The bot will not leave the group as it does in normal runtime behaviour.

## Customization

You can customize where the yml file is located. Set the `WABOT_YMLCONF` env variable for that
