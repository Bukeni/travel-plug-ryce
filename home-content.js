import { formatPostDate, loadPublishedPosts, normalizeMediaUrl, videoSource } from "./content-store.js";

function makeImage(url, alt, className) {
  if (!url) return null;
  const image = document.createElement("img");
  image.src = normalizeMediaUrl(url);
  image.alt = alt;
  image.loading = "lazy";
  image.className = className;
  return image;
}

function showStatus(element, message, isError = false) {
  element.textContent = message;
  element.classList.toggle("is-error", isError);
  element.hidden = !message;
}

async function renderStories() {
  const container = document.querySelector("[data-home-stories]");
  const status = document.querySelector("[data-home-stories-status]");
  try {
    const stories = await loadPublishedPosts("story", 3);
    container.replaceChildren();
    if (!stories.length) return showStatus(status, "New field notes will appear here as they are published.");
    for (const post of stories) {
      const card = document.createElement("article");
      card.className = "published-story-card";
      const image = makeImage(post.cover_image_url, "", "published-story-image");
      if (image) card.append(image);
      const meta = document.createElement("p");
      meta.className = "mono";
      meta.textContent = `FIELD NOTE · ${formatPostDate(post.published_at || post.created_at)}`;
      const title = document.createElement("h3");
      title.textContent = post.title;
      const excerpt = document.createElement("p");
      excerpt.textContent = post.excerpt;
      const link = document.createElement("a");
      link.className = "text-link dark-link";
      link.href = `blog.html#story-${encodeURIComponent(post.id)}`;
      link.textContent = "READ THE STORY ↗";
      card.append(meta, title, excerpt, link);
      container.append(card);
    }
    showStatus(status, "");
  } catch (error) {
    showStatus(status, `Published stories could not be loaded: ${error.message}`, true);
  }
}

function makeVideoCard(post) {
  const card = document.createElement("article");
  card.className = `published-video-card${post.post_type === "reel" ? " is-reel" : ""}`;
  const video = videoSource(post.media_url);
  if (video.kind === "file") {
    const player = document.createElement("video");
    player.src = video.url;
    player.controls = true;
    player.playsInline = true;
    player.preload = "none";
    if (post.cover_image_url) player.poster = normalizeMediaUrl(post.cover_image_url);
    card.append(player);
  } else {
    const frame = document.createElement("iframe");
    frame.src = video.url;
    frame.title = post.title;
    frame.loading = "lazy";
    frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    frame.allowFullscreen = true;
    card.append(frame);
  }
  const label = document.createElement("p");
  label.className = "mono";
  label.textContent = post.post_type === "reel" ? "NEW REEL" : "NEW VIDEO";
  const title = document.createElement("h3");
  title.textContent = post.title;
  card.append(label, title);
  return card;
}

async function renderVideos() {
  const container = document.querySelector("[data-home-videos]");
  const status = document.querySelector("[data-home-video-status]");
  try {
    const [reels, videos] = await Promise.all([
      loadPublishedPosts("reel", 4),
      loadPublishedPosts("video", 4)
    ]);
    const latestVideos = [...reels, ...videos]
      .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
      .slice(0, 4);
    container.replaceChildren(...latestVideos.map(makeVideoCard));
    showStatus(status, latestVideos.length ? "" : "New reels and videos will appear here when published.");
  } catch (error) {
    showStatus(status, `Published videos could not be loaded: ${error.message}`, true);
  }
}

renderStories();
renderVideos();
