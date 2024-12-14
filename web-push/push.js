const webPush = require("web-push");
const { notification } = require("../utils/log");
const { readSubscribers } = require("../utils/helper");

const vapIdKeys = {
  publicKey:
    "BH7NGMA8XZH0-LkDpurGD717UHlrFx7xhNp_n-ESvEhswqOVvwhalLX-HXKRzFGBCAxhAG-hT8ku9h4lzqr0VJ8",
  privateKey: "1yqLpUoKB060WAIbJrHkNzuREs8tQKX2ckPDW1ltHik",
};

webPush.setVapidDetails(
  "mailto:projects.notime@gmail.com",
  vapIdKeys.publicKey,
  vapIdKeys.privateKey
);

const sub = {
  endpoint:
    "https://fcm.googleapis.com/fcm/send/cClyw9mHvIY:APA91bHemUtESfbFyWpOs50JR-hRrW4lBXQ5WrjqDEQ9fDfw7lorHad6vxGseqn2oulVHzZxEgUKWu1frnHyLT4HbySpllDvciFgLSy0GSTDCqbY3rQ60-nLTp08Jvg0WgxSY7LvtDOS",
  expirationTime: null,
  keys: {
    p256dh:
      "BNCB-d__O2ioWOGDD1kKlTs3LYdYcZHfYrjqQ3i166M3P61QN5ADyPjOaTHbu9YZf-_MoTks4M9x7MBOsqtDzFw",
    auth: "PSEa4ZsHb2kuJs1RqTgWTw",
  },
};

const message = {
  notification: {
    title: "New Offer!",
    body: "Get Chicken Biryani at Paradise",
    image:
      "https://imgs.search.brave.com/AfJdINvn7bzoPvQLAXYEHDdHA0uNcjJMp_-MRVcEjkg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9teWZv/b2RzdG9yeS5jb20v/d3AtY29udGVudC91/cGxvYWRzLzIwMjEv/MDcvR2hlZS1SaWNl/LTEuanBn",
  },
};

const subscribers = readSubscribers() || [];

webPush
  .sendNotification(subscribers[0].token, JSON.stringify(message))
  .then(() => console.log("Notification sent"))
  .catch((err) => console.error("Error sending notification:", err));

module.exports = webPush;
