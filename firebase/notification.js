const { fcm } = require("./admin");
const { formatValidUntil } = require("../utils/dateFormat");
const log = require("../utils/log");
const webPush = require("../web-push/push.js");
const { readSubscribers } = require("../utils/helper");

const sendNewOfferNotification = async (newOffer) => {
  try {
    // Validate image URL size
    const isValidImage = newOffer.dishImage && newOffer.dishImage.length < 500;

    // Retrieve all subscribers
    const subscribers = readSubscribers() || [];

    // Prepare the notification message
    const message = {
      notification: {
        title: "New Offer!",
        body: `Get ${newOffer.dishName} at ${newOffer.hotelName} for just $${newOffer.newPrice}!`,
        ...(isValidImage && { image: newOffer.dishImage }),
      },
      android: {
        priority: "high",
      },
    };   

    // Send notifications to all subscribers asynchronously
    const notificationResults = await Promise.all(
      subscribers.map(async (subscriber) => {
        const sub = subscriber.token;
        
        try {
          await webPush.sendNotification(sub, JSON.stringify(message));
          // log.notification(`Notification sent to subscriber`);
          return { success: true, subscriber: sub };
        } catch (err) {
          // log.error(`Failed to send notification to ${sub}: ${err.message}`);
          return { success: false, subscriber: sub, error: err.message };
        }
      })
    );

    // Aggregate and log the results
    const successCount = notificationResults.filter((res) => res.success).length;
    const failureCount = notificationResults.length - successCount;

    // log.notification(
    //   `Notification Summary: ${successCount} sent, ${failureCount} failed.`
    // );

  } catch (error) {
    log.error(`Error sending new offer notification: ${error.message}`);
  }
};

module.exports = { sendNewOfferNotification };
