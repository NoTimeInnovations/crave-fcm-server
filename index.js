const express = require("express");
const cors = require("cors");
const { db } = require("./firebase/admin");
const notification = require("./firebase/notification");
const tokenRoutes = require("./routes/topic");
const testRoutes = require("./routes/test");
const log = require("./utils/log");
const dataRoute = require("./routes/data");
const autoDeleteExpiredOffers = require("./utils/autoDeleteExpiredOffer");
const pagesRoutes = require("./routes/pages");
const xlsx = require("xlsx");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cors("*"));

app.use("/api/topic", tokenRoutes);
app.use("/api", testRoutes);
app.use("/api", dataRoute);
app.use("/", pagesRoutes);

// Listen for new offers in Firebase Realtime Database
const offersRef = db.ref("offers");
offersRef.on("child_added", async (snapshot) => {
  const newOffer = snapshot.val();

  if (newOffer) {
    const filePath = "data/offers.xlsx";

    // Check if the file exists
    let workbook;
    if (fs.existsSync(filePath)) {
      // Read existing file
      workbook = xlsx.readFile(filePath);
    } else {
      // Create a new workbook with an "Offers" sheet
      workbook = xlsx.utils.book_new();
      workbook.SheetNames.push("Offers");
      workbook.Sheets["Offers"] = xlsx.utils.json_to_sheet([]);
      xlsx.writeFile(workbook, filePath);
    }

    // Read the "Offers" sheet
    const worksheet = workbook.Sheets["Offers"];
    const data = xlsx.utils.sheet_to_json(worksheet);

    // Add the new offer to the data
    data.push(newOffer);

    // Convert data back to a sheet and save it to the file
    const updatedSheet = xlsx.utils.json_to_sheet(data);
    workbook.Sheets["Offers"] = updatedSheet;
    xlsx.writeFile(workbook, filePath);

    log("New offer saved to offers.xlsx");
  }
});

const PORT = 3002;
app.listen(PORT, () => {
  autoDeleteExpiredOffers();
  log(`Server running on port ${PORT}`);
  setInterval(autoDeleteExpiredOffers, 7200000); // 2hr
});
