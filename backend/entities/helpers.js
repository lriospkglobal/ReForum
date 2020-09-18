const mongodb = require('mongodb');
const { Readable } = require('stream');
const fs = require('fs');

module.exports = {
  gridFsSave: (dbName, bucketName, buffer, photoName, client) => {
    return new Promise((resolve, reject) => {

      const db = client.db(dbName);

      // Covert buffer to Readable Stream
      const readablePhotoStream = new Readable();
      readablePhotoStream.push(buffer);
      readablePhotoStream.push(null);

      let bucket = new mongodb.GridFSBucket(db, {
        bucketName
      });

      let uploadStream = bucket.openUploadStream(photoName);
      let id = uploadStream.id;
      readablePhotoStream.pipe(uploadStream);

      uploadStream.on('error', () => {

        return reject({ message: "Error uploading file" });
      });

      uploadStream.on('finish', () => {

        return resolve({ photoName, id });

      });
    })
  },
  
  getImageFromGridFs: (obj, dbName, bucketName, client, forumId) => {
    return new Promise((resolve, reject) => {
      const db = client.db(dbName);
      const bucket = new mongodb.GridFSBucket(db, {
        chunkSizeBytes: 1024,
        bucketName
      });

      switch (Object.keys(obj)[0]) {
        case 'id':
        case 'filename':
          bucket.openDownloadStreamByName(obj['filename']).
            pipe(fs.createWriteStream(obj['filename'])).
            on('error', function (error) {

              reject(error)
            }).
            on('finish', function () {

              resolve({ savedFsFilename: obj['filename'], forumId })

            });
      }
    })






  },
  base64encodeBuffer: (buffer) => buffer.toString('base64')

  ,
  base64encode: (file) => {
    // read binary data
    const bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return bitmap.toString('base64');
  }
}
