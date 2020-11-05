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



  getImageFromGridFs: (fileName, dbName, bucketName, client, forumId) => {
    return new Promise((resolve, reject) => {
      const db = client.db(dbName);
      const bucket = new mongodb.GridFSBucket(db, {
        chunkSizeBytes: 1024,
        bucketName
      });


      const collectionChunks = db.collection(bucketName + '.chunks');

      bucket.find({ filename: fileName }).toArray((err, docs) => {
        if (err) return reject(err)
        //Retrieving the chunks from the db          
        collectionChunks.find({ files_id: docs[0]._id })
          .sort({ n: 1 }).toArray(function (err, chunks) {
            if (err) {
              return reject(err)
            }
            if (!chunks || chunks.length === 0) {
              //No data found            
              return reject('No data')
            }

            let fileData = [];
            for (let i = 0; i < chunks.length; i++) {


              fileData.push(chunks[i].data.toString('base64'));
            }
            if (forumId)
              resolve({ forumId, base64: fileData.join('') })
            else resolve(fileData.join(''))


          })

      })
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
