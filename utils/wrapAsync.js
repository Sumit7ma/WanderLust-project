module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next)
            .catch((err) => {
                next(err);  // Just pass the error to the next middleware
            });
    };
};
