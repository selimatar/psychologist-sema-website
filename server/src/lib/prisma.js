const { PrismaClient } = require('@prisma/client');

// Reuse a single client across the process (and across test files via require cache)
// instead of opening a new pool per import.
const prisma = new PrismaClient();

module.exports = prisma;
