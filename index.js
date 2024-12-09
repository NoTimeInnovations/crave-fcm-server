const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const { format, isToday, isTomorrow, parseISO, formatDistanceToNow } = require('date-fns');
const cors = require('cors');

function formatValidUntil(validUntil) {
  const parsedDate = parseISO(validUntil); // Parse the ISO date string into a Date object

  // Check if the date is today, tomorrow, or another day
  if (isToday(parsedDate)) {
    return `Today at ${format(parsedDate, 'hh:mm a')}`; // Format as 'today 12:00 PM'
  } else if (isTomorrow(parsedDate)) {
    return `Tomorrow at ${format(parsedDate, 'hh:mm a')}`; // Format as 'tomorrow 3:00 AM'
  } else {
    return `${format(parsedDate, 'EEEE')} at ${format(parsedDate, 'hh:mm a')}`; // Format as 'Monday at 5:00 PM'
  }
}

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://foodoffers-2cedb-default-rtdb.asia-southeast1.firebasedatabase.app",
});

const db = admin.database();
const fcm = admin.messaging();
const app = express();
app.use(express.json()); // Middleware to parse JSON requests
app.use(cors('*'))

// Listen for new offers added in Realtime Database
const offersRef = db.ref('offers');
offersRef.on('child_added', async (snapshot) => {
  try {
    const newOffer = snapshot.val();
    
    // Validate new offer data
    if (!newOffer){
      console.error('Offer data not found');
      return;
    }

    const message = {
      notification: {
        title : 'New Offer!!',
        body : `Get ${newOffer.dishName} at ${newOffer.hotelName} for just $${newOffer.newPrice}! Valid until ${formatValidUntil(newOffer.validUntil)}`,                                    
        image : newOffer.dishImage
      },
      android: {
        notification: {
          imageUrl: 'https://media.istockphoto.com/id/477369468/photo/chicken-hen-livestock.jpg?s=612x612&w=0&k=20&c=sJjuw19DSFzMKF-A_f_otJExZJ-m9PYhP_laeesehFg='
        }
      },
      apns: {
        payload: {
          aps: {
            'mutable-content': 1
          }
        },
        fcm_options: {
          image: 'https://media.istockphoto.com/id/477369468/photo/chicken-hen-livestock.jpg?s=612x612&w=0&k=20&c=sJjuw19DSFzMKF-A_f_otJExZJ-m9PYhP_laeesehFg='
        }
      },
      webpush: {
        headers: {
          image: 'https://media.istockphoto.com/id/477369468/photo/chicken-hen-livestock.jpg?s=612x612&w=0&k=20&c=sJjuw19DSFzMKF-A_f_otJExZJ-m9PYhP_laeesehFg='
        }
      },
      topic: 'new-offers', 
    };

    // Ensure message is not null or undefined
    if (!message || !message.topic) {
      throw new Error('Message must be a non-null object and contain valid data and topic.');
    }

    // Send message to devices subscribed to the 'new-offers' topic
    fcm.send(message)
      .then((response) => {
        console.log('Successfully sent message to topic:', response);
      })
      .catch((error) => {
        console.error('Error sending message:', error);
      });

  } catch (error) {
    console.error('Error sending notification:', error);
  }
});

// Endpoint to save FCM token and subscribe to topic
app.post('/api/save-token', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token and userId are required' });
  }

  try {

    // Subscribe the client to the 'new-offers' topic
    await fcm.subscribeToTopic([token], 'new-offers');
    console.log(`User subscribed to 'new-offers' topic`);

    res.status(200).json({ message: 'Token saved and client subscribed successfully' });
  } catch (error) {
    console.error('Error saving token and subscribing to topic:', error);
    res.status(500).json({ error: 'Failed to save token and subscribe to topic' });
  }
});

app.post('/api/unsubscribe-token', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token and userId are required' });
  }

  try {

    // unSubscribe the client to the 'new-offers' topic
    await fcm.unsubscribeFromTopic([token], 'new-offers');
    console.log(`User subscribed to 'new-offers' topic`);

    res.status(200).json({ message: 'Token deleted and client subscribed successfully' });
  } catch (error) {
    console.error('Error deleting token and subscribing to topic:', error);
    res.status(500).json({ error: 'Failed to delete token and subscribe to topic' });
  }
});

app.get('/api/test', async (req, res) => {

  const message = {
    notification: {
      title: 'Sparky says hello!',
      body: 'Hello, world!'
    },
    android: {
      notification: {
        imageUrl: 'https://media.istockphoto.com/id/477369468/photo/chicken-hen-livestock.jpg?s=612x612&w=0&k=20&c=sJjuw19DSFzMKF-A_f_otJExZJ-m9PYhP_laeesehFg='
      }
    },
    apns: {
      payload: {
        aps: {
          'mutable-content': 1
        }
      },
      fcm_options: {
        image: 'https://media.istockphoto.com/id/477369468/photo/chicken-hen-livestock.jpg?s=612x612&w=0&k=20&c=sJjuw19DSFzMKF-A_f_otJExZJ-m9PYhP_laeesehFg='
      }
    },
    webpush: {
      headers: {
        image: 'https://media.istockphoto.com/id/477369468/photo/chicken-hen-livestock.jpg?s=612x612&w=0&k=20&c=sJjuw19DSFzMKF-A_f_otJExZJ-m9PYhP_laeesehFg='
      }
    },
    topic: 'new-offers', 
  };

  // Ensure message is not null or undefined
  if (!message || !message.topic) {
    throw new Error('Message must be a non-null object and contain valid data and topic.');
  }

  // Send message to devices subscribed to the 'new-offers' topic
  fcm.send(message)
    .then((response) => {
      console.log('Successfully sent message to topic:', response);
    })
    .catch((error) => {
      console.error('Error sending message:', error);
    });

  res.status(200).json({ message: 'Test notification sent successfully' });

});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
