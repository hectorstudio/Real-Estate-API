// On CI, this file is missing and eslint can throw an error
/* eslint-disable import/no-unresolved */

import { Storage } from '@google-cloud/storage';
import path from 'path';

const serviceAccountKey = path.resolve(__dirname, '../../firebase_account_key.json');

const storage = new Storage({ keyFilename: serviceAccountKey });

export const filesBucket = storage.bucket('pocketbuildings-files');
