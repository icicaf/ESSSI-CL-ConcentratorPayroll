// config.js
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    ftp_servipag: {
      server: process.env.FTP_SERVIPAG_SERVER,
      username: process.env.FTP_SERVIPAG_USERNAME,
      password: process.env.FTP_SERVIPAG_PASSWORD,
    },
    ftp_banco_estado: {
      server: process.env.FTP2_BANCO_ESTADO_SERVER,
      username: process.env.FTP2_BANCO_ESTADO_USERNAME,
      password: process.env.FTP2_BANCO_ESTADO_PASSWORD,
    },
    ftp_webpay: {
      server: process.env.FTP2_WEBPAY_SERVER,
      username: process.env.FTP_WEBPAY_USERNAME,
      password: process.env.FTP_WEBPAY_PASSWORD,
    },
  };
  