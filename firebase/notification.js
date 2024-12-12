const { fcm } = require("./admin");
const { formatValidUntil } = require("../utils/dateFormat");
const log = require("../utils/log");

const sendNewOfferNotification = async (newOffer) => {
  try {
    const isValidImage =
      newOffer.dishImage && newOffer.dishImage.length < 500; // Ensure the image URL is within a reasonable size

    const message = {
      notification: {
        title: "New Offer!",
        body: `Get ${newOffer.dishName} at ${newOffer.hotelName} for just $${newOffer.newPrice}! Valid until ${formatValidUntil(newOffer.validUntil)}`,
        ...(isValidImage && { image: newOffer.dishImage }),
      },
      android: {
        priority: "high", 
      },
      topic: "new-offers",
    };

    const response = await fcm.send(message);
    log("\n\nisValidImage :  ", isValidImage);
    if(response){
        log(
            `Notification sent successfully at (${new Date().toLocaleDateString()}: ${new Date().toLocaleTimeString()}) Offer : ${newOffer.dishName} at ${newOffer.hotelName} for just $${newOffer.newPrice}! Valid until ${formatValidUntil(newOffer.validUntil)}`
          );
    }else{
        log("Notification not sent successfully" , response); 
    }
  } catch (error) {
    log.error("Error sending notification:", error);
  }
};

module.exports = { sendNewOfferNotification };
