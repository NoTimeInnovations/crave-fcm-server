const { db } = require('../firebase/admin'); 
const log = require('./log');

async function getOffers() {
    try {
        const snapshot = await db.ref('offers').once('value');
        const offers = [];
        snapshot.forEach(childSnapshot => {
            offers.push({
                id: childSnapshot.key,
                ...childSnapshot.val()
            });
        });
        return offers;
    } catch (error) {
        log.error('Error fetching offers from the database:', error);
        return [];
    }
}


function deleteOffer(offerId) {
    db.ref(`offers/${offerId}`).remove()
        .then(() => {
            log(`Offer with ID ${offerId} has been deleted.`);
        })
        .catch(error => {
            log.error(`Error deleting offer with ID ${offerId}:`, error);
        });
}

async function autoDeleteExpiredOffers() {
    const offers = await getOffers();
    const now = new Date();

    offers.forEach(offer => {
        if (new Date(offer.validUntil) < now) {
            deleteOffer(offer.id);
        }
    });
}


module.exports = autoDeleteExpiredOffers;
