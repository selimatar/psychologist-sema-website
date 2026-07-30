const { z } = require('zod');

const TOPICS = ['anxiety', 'stress', 'transitions', 'grief', 'depression', 'trauma', 'unsure'];

const createBookingRequestSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    email: z.string().trim().email(),
    topic: z.enum(TOPICS).optional(),
    notes: z.string().trim().max(2000).optional(),
    slotStart: z.string().datetime(),
    slotEnd: z.string().datetime(),
  })
  .transform((data) => ({
    ...data,
    slotStart: new Date(data.slotStart),
    slotEnd: new Date(data.slotEnd),
  }))
  .refine((data) => data.slotStart < data.slotEnd, {
    message: 'slotStart must be before slotEnd',
    path: ['slotStart'],
  });

module.exports = { createBookingRequestSchema, TOPICS };
