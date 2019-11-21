import * as admin from 'firebase-admin';

import serviceAccount from './firebase_account_key.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://upheld-clone-259000.firebaseio.com',
});

export default admin;
