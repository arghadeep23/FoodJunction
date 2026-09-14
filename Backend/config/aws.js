const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const crypto = require('crypto');
const { promisify } = require('util');
const randomBytes = promisify(crypto.randomBytes);

const s3Client = new S3Client({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.ACCESS_KEYID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
    }
});

// provides the url for the image (for putting)
async function generateUploadURL(contentType) {
    const rawBytes = await randomBytes(16); // generates 16 random bytes
    const imageName = rawBytes.toString('hex'); // converting the bytes into hexadecimal
    const command = new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: imageName,
        ContentType: contentType
    });
    return getSignedUrl(s3Client, command);
}

module.exports = { generateUploadURL };
