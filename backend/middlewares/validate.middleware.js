export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    console.error("Validation Middleware Error:", err);
    return res.status(400).json({
      errors: err.errors ? err.errors.map(e => ({ field: e.path.join('.'), message: e.message })) : err.message
    });
  }
};
