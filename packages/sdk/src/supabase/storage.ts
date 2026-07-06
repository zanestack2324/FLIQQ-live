import { supabase } from './client';

function getFileExtension(uri: string): string {
  const match = uri.match(/\.(\w+)(?:\?.*)?$/);
  return match ? match[1] : 'jpg';
}

function getMimeType(ext: string): string {
  const mimes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    pdf: 'application/pdf',
  };
  return mimes[ext] || 'image/jpeg';
}

async function uploadFile(
  bucket: string,
  path: string,
  fileUri: string,
  contentType?: string,
): Promise<string> {
  const response = await fetch(fileUri);
  const blob = await response.blob();

  const { error } = await supabase.storage.from(bucket).upload(path, blob, {
    contentType: contentType || getMimeType(getFileExtension(fileUri)),
    upsert: true,
  });
  if (error) throw error;

  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path);
  return publicUrlData.publicUrl;
}

export async function uploadAvatar(userId: string, fileUri: string): Promise<string> {
  const ext = getFileExtension(fileUri);
  const path = `${userId}/avatar.${ext}`;
  return uploadFile('avatars', path, fileUri);
}

export async function uploadDocument(
  userId: string,
  fileUri: string,
  documentType: string,
): Promise<string> {
  const ext = getFileExtension(fileUri);
  const timestamp = Date.now();
  const path = `${userId}/${documentType}_${timestamp}.${ext}`;
  return uploadFile('verification-documents', path, fileUri);
}

export async function uploadStreamThumbnail(streamId: string, fileUri: string): Promise<string> {
  const ext = getFileExtension(fileUri);
  const path = `${streamId}/thumbnail.${ext}`;
  return uploadFile('stream-thumbnails', path, fileUri);
}

export async function deleteFile(bucket: string, path: string): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
}



