const admin = require('firebase-admin');
const serviceAccount = require('../config/service.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

exports.sendNotification = (token, payload) => {
  admin.messaging().sendToDevice(token, payload)
    .then(response => {
      console.log('Successfully sent message:', response);
    })
    .catch(error => {
      console.log('Error sending message:', error);
    });
};
