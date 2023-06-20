const { S3Client, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const { filesize } = require("filesize");

module.exports.handler = async (event) => {
  const s3Client = new S3Client({ region: "us-east-1" });
  const command = new ListObjectsV2Command({
    Bucket: process.env.BUCKET_NAME,
    // The default and maximum number of keys returned is 1000.
    // MaxKeys: 1,
  });

  const bucketObjects = await s3Client.send(command);
  console.log("bucketObjects => ", bucketObjects);

  const filesData = bucketObjects.Contents.map((o) => {
    return {
      Key: o.Key,
      Size: filesize(o.Size),
    };
  });

  return {
    statusCode: 200,
    body: JSON.stringify(filesData),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
    },
  };
};
