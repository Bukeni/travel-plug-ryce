import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const config = window.TRAVEL_PLUG_SUPABASE;
let client;

export function isSupabaseConfigured() {
  return Boolean(
    config?.url
    && config?.anonKey
    && !config.url.includes("YOUR_PROJECT_ID")
    && !config.anonKey.includes("YOUR_SUPABASE_ANON_KEY")
  );
}

export function getSupabase() {
  if (!isSupabaseConfigured()) {
    throw new Error("Publishing is not configured yet. Add your Supabase project URL and anon key to supabase-config.js.");
  }
  if (!client) {
    client = createClient(config.url, config.anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
  }
  return client;
}

export function normalizeMediaUrl(value) {
  if (!value) return "";
  const url = new URL(value, window.location.href);
  if (!["https:", "http:"].includes(url.protocol)) {
    throw new Error("Media links must use http or https.");
  }
  return url.href;
}

export function videoSource(value) {
  const url = new URL(value);
  if (url.protocol !== "https:") {
    throw new Error("Use a secure https link for video.");
  }

  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  let videoId = "";
  if (host === "youtu.be") {
    videoId = url.pathname.split("/").filter(Boolean)[0] || "";
  } else if (["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(host)) {
    videoId = url.searchParams.get("v") || url.pathname.match(/^\/(?:embed|shorts)\/([^/?]+)/)?.[1] || "";
  }
  if (videoId) {
    if (!/^[\w-]{6,20}$/.test(videoId)) throw new Error("That YouTube link does not look valid.");
    return { kind: "embed", url: `https://www.youtube-nocookie.com/embed/${videoId}` };
  }
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const vimeoId = url.pathname.match(/(?:video\/)?(\d+)/)?.[1];
    if (!vimeoId) throw new Error("That Vimeo link does not look valid.");
    return { kind: "embed", url: `https://player.vimeo.com/video/${vimeoId}` };
  }
  if (/\.(mp4|webm|ogg)$/i.test(url.pathname)) return { kind: "file", url: url.href };
  throw new Error("Use a YouTube, Vimeo, MP4, WebM, or Ogg video link.");
}

export async function loadPublishedPosts(type, limit) {
  let query = getSupabase().from("content_posts").select("*").eq("is_published", true);
  if (type) query = query.eq("post_type", type);
  if (limit) query = query.limit(limit);
  const { data, error } = await query.order("published_at", { ascending: false });
  if (error) throw error;
  const imagePaths = [...new Set(data.flatMap((post) => [
    post.cover_image_url,
    ...(post.image_paths || [])
  ]).filter(Boolean))];
  if (!imagePaths.length) return data;
  const { data: signedImages, error: imageError } = await getSupabase()
    .storage.from("travel-plug-media").createSignedUrls(imagePaths, 3600);
  if (imageError) throw imageError;
  const imageUrls = new Map(signedImages.map((image) => [image.path, image.signedUrl]));
  return data.map((post) => {
    const resolveImage = (path) => {
      if (!path) return null;
      const signedUrl = imageUrls.get(path);
      if (!signedUrl) throw new Error("A published post image could not be accessed.");
      return signedUrl;
    };
    return {
      ...post,
      cover_image_url: resolveImage(post.cover_image_url),
      image_paths: (post.image_paths || []).map(resolveImage)
    };
  });
}

export async function loadAdminPosts() {
  const { data, error } = await getSupabase()
    .from("content_posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function savePost(fields, imageFiles) {
  const supabase = getSupabase();
  const title = fields.title.trim();
  if (!title) throw new Error("Add a title before saving.");
  if (!["story", "reel", "video"].includes(fields.post_type)) throw new Error("Choose a valid post type.");
  if (!["draft", "published"].includes(fields.status)) throw new Error("Choose draft or published.");
  const body = fields.body?.trim() || "";
  if (fields.post_type === "story" && !body) throw new Error("Add the story text before saving.");
  const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);
  const images = [...(imageFiles || [])];
  if (fields.post_type !== "story" && images.length > 1) {
    throw new Error("Choose one cover image for a reel or video.");
  }
  if (images.some((image) => !allowedImageTypes.has(image.type) || image.size > 10 * 1024 * 1024)) {
    throw new Error("Choose JPG, PNG, WebP, GIF, or AVIF images smaller than 10 MB each.");
  }
  const mediaUrl = fields.media_url.trim();
  if (fields.post_type !== "story" && !mediaUrl) throw new Error("Add a video link for reels and videos.");
  if (mediaUrl) videoSource(mediaUrl);

  let coverImageUrl = fields.cover_image_url || null;
  let imagePaths;
  try {
    imagePaths = JSON.parse(fields.image_paths || "[]");
  } catch {
    throw new Error("The saved image list is invalid. Cancel editing and try again.");
  }
  if (!Array.isArray(imagePaths) || imagePaths.some((path) => typeof path !== "string")) {
    throw new Error("The saved image list is invalid. Cancel editing and try again.");
  }
  if (images.length) {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error("Sign in again to upload an image.");
    for (const image of images) {
      const extension = image.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from("travel-plug-media")
        .upload(path, image, { contentType: image.type, upsert: false });
      if (uploadError) throw uploadError;
      imagePaths.push(path);
      if (!coverImageUrl) coverImageUrl = path;
    }
  }

  const post = {
    title,
    excerpt: fields.excerpt.trim(),
    body,
    post_type: fields.post_type,
    media_url: mediaUrl || null,
    cover_image_url: coverImageUrl,
    image_paths: imagePaths,
    is_published: fields.status === "published"
  };
  const query = fields.id
    ? supabase.from("content_posts").update(post).eq("id", fields.id)
    : supabase.from("content_posts").insert(post);
  const { error } = await query;
  if (error) throw error;
}

export async function deletePost(id) {
  const { error } = await getSupabase().from("content_posts").delete().eq("id", id);
  if (error) throw error;
}

export function formatPostDate(value) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
}
