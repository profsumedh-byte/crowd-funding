import { cloudinary } from '@/app/lib/cloudinary';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('profile_pic');

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    // File validation for security and data leak prevention
    if (!file.type.startsWith('image/')) {
      return Response.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return Response.json({ error: "File size exceeds 5MB limit" }, { status: 400 });
    }

    const fileBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(fileBuffer).toString('base64');
    const fileUri = `data:${file.type};base64,${base64}`;

    const result = await cloudinary.uploader.upload(fileUri, {
      folder: 'Profile_Pic',
    });

    return Response.json({ url: result.secure_url });

  } catch (error) {
    console.error("Upload error:", error);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}