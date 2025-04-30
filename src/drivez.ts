import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import mime from "mime-types";

interface DrivezConfig {
  accessKeyId: string;
  secretAccessKey: string;
  accountId: string;
  bucket: string;
}

export class Drivez {
  private client: S3Client;
  private bucket: string;

  constructor(config: DrivezConfig) {
    const { accountId, accessKeyId, secretAccessKey, bucket } = config;
    this.bucket = bucket;

    this.client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    });
  }

  getS3Client(): S3Client {
    if (!this.client) {
      throw new Error("S3Client is not initialized");
    }
    return this.client;
  }

  async putObject(
    key: string,
    body: Buffer | string,
    contentType?: string,
    bucket: string = this.bucket
  ): Promise<any> {
    const type = contentType || mime.lookup(key) || "application/octet-stream";

    if (!this.client) {
      throw new Error("S3Client is not initialized");
    }
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: type,
    });

    return this.client.send(command);
  }

  async getObject(params: any): Promise<any> {
    try {
      const command = new GetObjectCommand(params);
      const data = await this.client.send(command);
      return data;
    } catch (error) {
      console.error("Error getting object:", error);
      throw error;
    }
  }

  async getSignedUrlForPut(
    key: string,
    expiresIn: number = 3600,
    bucket: string = this.bucket
  ): Promise<string> {
    try {
      const url = await getSignedUrl(
        this.client,
        new PutObjectCommand({ Bucket: bucket, Key: key }),
        { expiresIn: expiresIn }
      );
      return url;
    } catch (error) {
      console.error("Error getting signed URL for PUT:", error);
      throw error;
    }
  }

  async getSignedUrlForGet(
    key: string,
    expiresIn: number = 3600,
    bucket: string = this.bucket
  ): Promise<string> {
    try {
      const url = await getSignedUrl(
        this.client, // Use the instance's S3Client
        new GetObjectCommand({ Bucket: bucket, Key: key }),
        { expiresIn: expiresIn }
      );
      return url;
    } catch (error) {
      console.error("Error getting signed URL for GET:", error);
      throw error;
    }
  }
}
