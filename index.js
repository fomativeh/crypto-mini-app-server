const { Telegraf } = require("telegraf");
const { link } = require("telegraf/format");
require("dotenv/config");
const mongoose = require("mongoose");
const express = require("express");
const User = require("./model/userModel");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello world");
});

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
  const { username, id } = ctx.from;
  try {
    //check if user already exists

    const userExists = await User.findOne({ telegram_id: id });

    if (!userExists) {
      const newUser = new User({ telegram_id: id });
      await newUser.save();
    }

    const initData = JSON.stringify({ telegram_id: id });

    ctx.telegram.sendMessage(
      ctx.chat.id,
      `Hey, @${username}\nWelcome to @crypto\nPlease click the button below to follow our socials.`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Join our socials.",
                web_app: {
                  url: process.env.FRONTEND_URL,
                  initData: initData,
                },
              },
            ],
          ],
        },
      }
    );
  } catch (error) {
    console.log(error)
  }
});

// Listen for new chat members
bot.on("new_chat_members", (ctx) => {
  const newUser = ctx.message.new_chat_members[0];
  const username = newUser.username;

  ctx.reply(
    `Hey @${username}👋\nWelcome to the group!\nPlease click the link below to follow our socials`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Join our socials.",
              url: process.env.DIRECT_LINK,
            },
          ],
        ],
      },
    }
  );
});

bot.command("welcometest", (ctx) => {
  ctx.reply(link("Launch", process.env.DIRECT_LINK));
});

bot.on('message', (ctx) => {
  console.log(ctx)
  if (ctx.update.message.web_app_data) {
    const data = JSON.parse(ctx.update.message.web_app_data);
    console.log(`Received data from Mini App:\n ${data}`); // Replace "yourData" with the actual key
    // Handle the data here
  }
});

// // Mini App initialization (replace with your details)
// const miniApp = new TelegramWebApp({
//   token: process.env.BOT_TOKEN, // Mini App token
//   url: process.env.FRONTEND_URL, // Mini App URL
// });

// app.use('/tg-bot', miniApp.middleware());

// Set bot commands for Telegram
bot.telegram.setMyCommands([
  { command: "start", description: "Start the crypto welcome Bot" },
]);

app.get("/", (req, res) => {
  res.send("Hello-world");
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

mongoose
  .connect(process.env.URI)
  .then(() => console.log("Connected to db."))
  .catch((err) => console.log(`Error connecting to db:\n${err}`));

bot.launch();
