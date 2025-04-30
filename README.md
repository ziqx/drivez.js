# DRIVEZ

S3 Compatible file upload system with Cloudflare R2.

> This package is mainly made for `Ziqx` Projects. Without specific needs this package maybe overhead for your project.

## Server

**Create Instance**

```ts
const drive = new Drivez({
  accessKeyId: CF_ACCESS_KEY,
  secretAccessKey: CF_SECRET_KEY,
  accountId: CF_AC_ID,
  bucket: "bucket_name",
});
```

**Functions**

```ts
// Get S3 Client
drive.getS3Client();

// Get Signed PUT URL:
await drive.getSignedUrlForPut("my-pic.jpg");

// Get Signed GET URL:
await drive.getSignedUrlForGet("my-pic.jpg");
```

## Client

You can utilize client functions

```ts
const client = new DrivezClient();
const uploaded: boolean = await client.uploadFile(file, presignedUrl);
```
