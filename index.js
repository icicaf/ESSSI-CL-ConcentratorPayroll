const dotenv = require('dotenv');
const ftp = require("ftp");
const { Storage } = require('@google-cloud/storage');
const config_ftp = require("./config_ftp.js");

dotenv.config();

// Configurar la autenticación con las credenciales de la cuenta de servicio
const storage = new Storage({
  keyFilename: './storage_account.json',
});

exports.concentratorPayroll = async (req, res) => {
  try {
    
    const { server1, username1, password1 } = config_ftp.ftp_servipag;
    const { server2, username2, password2 } = config_ftp.ftp_banco_estado;
    const { server3, username3, password3 } = config_ftp.ftp_webpay;

    const bucketName = 'esssi-cs-storage_concentrator_payroll';
    const remoteFilePath = "/input/archive_csv.zip";

    const client = new ftp();

    await new Promise((resolve, reject) => {
      client.on("ready", resolve);
      client.on("error", reject);

      client.connect({
        host: server1,
        user: username1,
        password: password1,
      });
    });

    const fileExists = await new Promise((resolve, reject) => {
      client.size(remoteFilePath, (err, size) => {
        if (err) {
          return resolve(false);
        }
        resolve(size > 0);
      });
    });

    if (!fileExists) {
      client.end();
      return res.status(404).send("El archivo no existe en el servidor FTP.");
    }

    client.get(remoteFilePath, (err, stream) => {
      if (err) {
        client.end();
        return res.status(500).send("Error al descargar el archivo desde el servidor FTP");
      }

      const bucket = storage.bucket(bucketName);
      const newRemoteFilePath = "archive_csv.zip";
      const file = bucket.file(newRemoteFilePath);
      stream.pipe(file.createWriteStream())
        .on('error', (err) => {
          console.error('Error al subir el archivo a Cloud Storage:', err);
          res.status(500).send('Error al subir el archivo a Cloud Storage.');
        })
        .on('finish', () => {
          client.end();
          console.log('Archivo subido correctamente a Cloud Storage.');
          res.status(200).send('Archivo subido correctamente a Cloud Storage.');
        });
    });
  } catch (error) {
    console.error('Error en la Cloud Function:', error);
    res.status(500).send('Error en la Cloud Function.');
  }
};
