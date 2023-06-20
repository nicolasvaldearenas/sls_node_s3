const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

module.exports.handler = async (event) => {
  const s3Client = new S3Client({ region: "us-east-1" });

  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: decodeURI(event.pathParameters.fileKey),
  });

  const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

  return {
    statusCode: 200,
    body: JSON.stringify(presignedUrl),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
    },
  };
};
