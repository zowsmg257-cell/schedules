const fs = require("fs");

const token = process.env.BOT_TOKEN;

async function send(chatId, text) {

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: text
    })
  });

}

async function run() {

  const tasks = JSON.parse(fs.readFileSync("tasks.json"));

  const now = new Date();

  for (let t of tasks) {

    const time = new Date(t.datetime);
    const diff = time - now;

    if (!t.notified && diff <= 3600000 && diff > 0) {

      await send(
        t.chatId,
        `⏰ 1시간 후 일정\n${t.task}\n${t.datetime}`
      );

      t.notified = true;

    }

  }

  fs.writeFileSync("tasks.json", JSON.stringify(tasks,null,2));

}

run();
