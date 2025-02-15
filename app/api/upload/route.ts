import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: file.type,
    };
    await s3.send(new PutObjectCommand(uploadParams));
    return NextResponse.json(
      {
        message: "File uploaded successfully!",
        fileUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    NextResponse.json({ message: "Failed to upload file" }, { status: 500 });
    return;
  }
}
