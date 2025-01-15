import path from 'path';
import url from 'url';
import express from 'express';

import cors from 'cors'
// import cookieParser from 'cookie-parser';

import rateLimit from 'express-rate-limit';

import routes from './routes/index.js';

import logger from './middleware/logger.js';
import globalErrorHandler from './middleware/errorController.js';
import AppError from './utils/appError.js';
import prisma from './db/db.config.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// setup static folder
// It will make available directly all the files which is avaialble in public folder  like if we want to access about.html then we can access it by localhost:8000/about
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
// app.use(express.json({ limit: '10kb' })); // if body is larger than 10kb than not accepted
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.set('trust proxy', 1);
// Limit requests from same API
// const limiter = rateLimit({
//     max: 100,
//     windowMs: 60 * 60 * 1000,
//     message: 'Too many requests from this IP, please try again in an hour!'
// });

// app.use('/api', limiter);

// Logger middleware
app.use(logger);

// Routes
// app.use('/api/posts', posts);




app.use('/api', routes);





app.get('/health', async (req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`
      res.status(200).json({ status: 'Database connection is healthy' })
    } catch (error) {
      res.status(500).json({ status: 'Database connection error' })
    }
})

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error Handler
app.use(globalErrorHandler);

export default app;