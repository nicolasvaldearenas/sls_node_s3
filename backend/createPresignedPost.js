const { S3Client, AbortMultipartUploadCommand } = require("@aws-sdk/client-s3");
const { createPresignedPost } = require("@aws-sdk/s3-presigned-post");

module.exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { filename, tags } = body;

  console.log("process.env.BUCKET_NAME => ", process.env.BUCKET_NAME);

  const s3Client = new S3Client({ region: "us-east-1" });

  // missing proper error handling
  const postObj = await createPresignedPost(s3Client, {
    Bucket: process.env.BUCKET_NAME,
    Key: filename,
    Expires: 90,
    // Conditions: tags && [["starts-with", "$tagging", ""]],
  });

  console.log("postObj => ", postObj);

  return {
    statusCode: 200,
    body: JSON.stringify({
      url: postObj.url,
      fields: {
        ...postObj.fields,
        // augment post object with the tagging values
        // tagging: tags ? buildXMLTagSet(tags) : undefined,
      },
    }),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "POST,OPTIONS",
    },
  };
};
