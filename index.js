const express = require("express");
const cors = require("cors");
const { fdb, db } = require("./firebase/admin");
const notification = require("./firebase/notification");
const tokenRoutes = require("./routes/topic");
const testRoutes = require("./routes/test");
const log = require("./utils/log");
const dataRoute = require("./routes/data");
const autoDeleteExpiredOffers = require("./utils/autoDeleteExpiredOffer");
const pagesRoutes = require("./routes/pages");
const xlsx = require("xlsx");
const fs = require("fs");
const { updateGitHubJson } = require("./github/updateGithubJson");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors("*"));

app.use("/api/topic", tokenRoutes);
app.use("/api", testRoutes);
app.use("/api", dataRoute);
app.use("/", pagesRoutes);

const offersQueue = [];
let isProcessingQueue = false;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function processOffersQueue() {
  if (isProcessingQueue) return;

  isProcessingQueue = true;

  while (offersQueue.length > 0) {
    const offer = offersQueue.shift();

    try {
      console.log("Processing offer:", offer.id);
      const offersCollection = fdb.collection("offers");
      await offersCollection.doc(offer.id).set({
        id: offer.id,
        ...offer,
      });
    } catch (error) {
      console.error("Failed to process offer:", offer.id, error.message);
    }

    await sleep(1000); 
  }

  isProcessingQueue = false;
}

const offersRef = db.ref("offers");
offersRef.on("child_added", (snapshot) => {
  const newOffer = snapshot.val();

  if (newOffer) {
    offersQueue.push({ ...newOffer, id: snapshot.key });
    processOffersQueue();
  }
});

const PORT = 3002;
app.listen(PORT, () => {
  autoDeleteExpiredOffers();
  log(`Server running on port ${PORT}`);
  setInterval(autoDeleteExpiredOffers, 7200000); // 2hr
});
