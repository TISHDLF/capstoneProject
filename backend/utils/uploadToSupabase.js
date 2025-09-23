// backend/utils/uploadToSupabase.js
import supabase from "../supabaseClient.js";
import { v4 as uuidv4 } from "uuid";

export async function uploadFileToSupabase(file, bucket = "uploads") {
  const filename = `${uuidv4()}-${file.originalname}`;
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filename, file.buffer, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.mimetype,
    });

  if (error) {
    throw error;
  }

  // Get public URL
  const { data: publicUrl } = supabase.storage
    .from(bucket)
    .getPublicUrl(filename);

  return publicUrl.publicUrl;
}
