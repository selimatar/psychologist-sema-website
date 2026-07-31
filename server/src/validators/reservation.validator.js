const { z } = require('zod');

const createReservationSchema = z
  .object({
    slotStart: z.string().datetime(),
    slotEnd: z.string().datetime(),
    clientName: z.string().trim().min(1).max(120).optional(),
    clientEmail: z.string().trim().email().optional(),
    notes: z.string().trim().max(2000).optional(),
  })
  .transform((d) => ({ ...d, slotStart: new Date(d.slotStart), slotEnd: new Date(d.slotEnd) }))
  .refine((d) => d.slotStart < d.slotEnd, {
    message: 'slotStart must be before slotEnd',
    path: ['slotStart'],
  });

const rescheduleReservationSchema = z
  .object({
    slotStart: z.string().datetime(),
    slotEnd: z.string().datetime(),
  })
  .transform((d) => ({ slotStart: new Date(d.slotStart), slotEnd: new Date(d.slotEnd) }))
  .refine((d) => d.slotStart < d.slotEnd, {
    message: 'slotStart must be before slotEnd',
    path: ['slotStart'],
  });

const rejectSchema = z.object({
  reason: z.string().trim().max(500).optional(),
});

module.exports = { createReservationSchema, rescheduleReservationSchema, rejectSchema };
