const notFoundHandler = (req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
};

const errorHandler = (err, req, res, next) => {
    console.error('Unhandled error:', err.message);
    res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error' });
};

export { notFoundHandler, errorHandler };
