// Generic middleware factory: validates req[part] against a Zod schema and
// replaces it with the parsed (coerced/defaulted) value, or responds 400.
function validate(schema, part = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[part]);
    if (!result.success) {
      return res.status(400).json({ error: 'VALIDATION_ERROR', details: result.error.flatten() });
    }
    req[part] = result.data;
    next();
  };
}

module.exports = validate;
