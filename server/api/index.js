// Vercel serverless entry point: the Express app itself is a valid Node.js
// request handler (req, res) => {}, so no adapter is needed — every request
// is rewritten here (see ../vercel.json) and handled by Express's own router.
module.exports = require('../src/app');
