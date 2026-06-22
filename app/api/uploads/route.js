import { cloudinary } from '@/app/lib/cloudinary';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    const fileBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(fileBuffer).toString('base64');
    const fileUri = `data:${file.type};base64,${base64}`;

    const result = await cloudinary.uploader.upload(fileUri, {
      folder: 'buy-me-gta',
    });

    return Response.json({ url: result.secure_url });

  } catch (error) {
    console.error("Upload error:", error);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}