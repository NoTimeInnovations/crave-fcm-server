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
        body: `Get ${newOffer.dishName} at ${newOffer.hotelName} for just $${newOffer.newPrice}!`,
        ...(isValidImage && { image: newOffer.dishImage }),
      },
      android: {
        priority: "high", 
      },
      topic: "all-offers"
    };

    const response = await fcm.send(message);
    if(response){
        log.notification(
            `Notification sent successfully at Offer : ${newOffer.dishName} at ${newOffer.hotelName} for just $${newOffer.newPrice}!`
          );
    }else{
        log.error("Notification not sent successfully" + response); 
    }
  } catch (error) {
    log.error("Error sending notification:" + error);
  }
};

module.exports = { sendNewOfferNotification };
