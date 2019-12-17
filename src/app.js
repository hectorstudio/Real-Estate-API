import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import router from './routes';

const app = express();

// Project root path
global.projectPath = path.join(__dirname, '../');

app.use(logger('dev'));
app.use(cors());
app.use(express.json({
  limit: '10MB', // Required higher value to accept file uploads
}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

router(app);

export default app;
