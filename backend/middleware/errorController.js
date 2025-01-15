const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    console.log("error reached here", err.message);

    res.status(err.statusCode).json({msg: err.message});
};

export default globalErrorHandler;