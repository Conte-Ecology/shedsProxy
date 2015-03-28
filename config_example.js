module.exports = {
  port: 3000,
  maintenance: false,
  // [host]: [target address]
  router: {
    '127.0.0.1:3000': 'http://127.0.0.1:3001'
  }
};
