import { Storage } from '@google-cloud/storage';
import path from 'path';

const serviceAccountKey = path.resolve(__dirname, '../../firebase_account_key.json');

const storage = new Storage({ keyFilename: serviceAccountKey });

export const filesBucket = storage.bucket('pocketbuildings-files');
