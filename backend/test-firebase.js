const db = require('./firebase');

async function testFirebase() {
  try {
    await db.collection('test').doc('sample').set({ message: 'Firebase works!' });
    console.log('Firebase test successful!');
  } catch (error) {
    console.error('Firebase test failed:', error);
  }
}

testFirebase();
