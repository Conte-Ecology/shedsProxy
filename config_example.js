module.exports = {
  port: process.env.SHEDS_PROXY_PORT || 3000,
  // [host]: [target address]
  router: {
    '127.0.0.1:3000': 'http://127.0.0.1:3001'
  }
};
