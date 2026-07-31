const { z } = require('zod');

const availabilityQuerySchema = z
  .object({
    from: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    to: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  })
  .transform(({ from, to }) => ({ from: new Date(from), to: new Date(to) }))
  .refine(({ from, to }) => from < to, { message: '`from` must be before `to`' });

module.exports = { availabilityQuerySchema };
