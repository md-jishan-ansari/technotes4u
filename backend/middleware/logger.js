
const logger = (req, res, next) => {
    // req.requestTime = new Date().toISOString();
    console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    next();
}

export default logger;
