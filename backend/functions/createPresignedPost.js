const { S3Client, AbortMultipartUploadCommand } = require("@aws-sdk/client-s3");
const { createPresignedPost } = require("@aws-sdk/s3-presigned-post");

module.exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { filename, tags } = body;

  const s3Client = new S3Client({ region: "us-east-1" });

  const postObj = await createPresignedPost(s3Client, {
    Bucket: process.env.BUCKET_NAME,
    Key: filename,
    Expires: 90,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      url: postObj.url,
      fields: {
        ...postObj.fields,
      },
    }),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "POST,OPTIONS",
    },
  };
};
