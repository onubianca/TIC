import { admin } from '../config/firebaseConfig.js';

const email = 'admin@test.com'; 

const user = await admin.auth().getUserByEmail(email);
await admin.auth().setCustomUserClaims(user.uid, { role: 'admin' });
console.log(`Done! ${email} is now admin.`);
process.exit(0);