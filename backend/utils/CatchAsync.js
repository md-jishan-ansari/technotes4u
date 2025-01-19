const CatchAsync = (fn) => {
    return async (req, res, next) => {
        try {
            const result = await fn(req, res, next);
            return result;
        } catch (error) {
            next(error);
        }
    }
}

export default CatchAsync;