import { formatPostDate, loadPublishedPosts, normalizeMediaUrl, videoSource } from "./content-store.js";

const navButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
navButton.addEventListener("click", () => {
  const expanded = navButton.getAttribute("aria-expanded") === "true";
  navButton.setAttribute("aria-expanded", String(!expanded));
  navButton.setAttribute("aria-label", expanded ? "Open navigation" : "Close navigation");
  nav.classList.toggle("open", !expanded);
});
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  nav.classList.remove("open");
  navButton.setAttribute("aria-expanded", "false");
  navButton.setAttribute("aria-label", "Open navigation");
}));

const dialog = document.querySelector(".published-story-dialog");
dialog.querySelector(".modal-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

function setStatus(element, message, isError = false) {
  element.textContent = message;
  element.classList.toggle("is-error", isError);
  element.hidden = !message;
}

function makeVideo(post) {
  const source = videoSource(post.media_url);
  if (source.kind === "file") {
    const player = document.createElement("video");
    player.src = source.url;
    player.controls = true;
    player.playsInline = true;
    player.preload = "none";
    if (post.cover_image_url) player.poster = normalizeMediaUrl(post.cover_image_url);
    return player;
  }
  const frame = document.createElement("iframe");
  frame.src = source.url;
  frame.title = post.title;
  frame.loading = "lazy";
  frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  frame.allowFullscreen = true;
  return frame;
}

function makeStoryCard(post) {
  const card = document.createElement("article");
  card.className = "blog-story-card";
  card.id = `story-${post.id}`;
  if (post.cover_image_url) {
    const image = document.createElement("img");
    image.src = normalizeMediaUrl(post.cover_image_url);
    image.alt = "";
    image.loading = "lazy";
    card.append(image);
  }
  const meta = document.createElement("p");
  meta.className = "mono";
  meta.textContent = `FIELD NOTE · ${formatPostDate(post.published_at || post.created_at)}`;
  const title = document.createElement("h3");
  title.textContent = post.title;
  const excerpt = document.createElement("p");
  excerpt.textContent = post.excerpt;
  const button = document.createElement("button");
  button.className = "text-link dark-link";
  button.type = "button";
  button.textContent = "READ THE STORY ↗";
  button.addEventListener("click", () => openStory(post));
  card.append(meta, title, excerpt, button);
  return card;
}

function openStory(post) {
  const image = dialog.querySelector(".published-dialog-image");
  image.hidden = !post.cover_image_url;
  image.removeAttribute("src");
  if (post.cover_image_url) {
    image.src = normalizeMediaUrl(post.cover_image_url);
    image.alt = post.title;
  }
  dialog.querySelector("[data-dialog-meta]").textContent = `FIELD NOTE · ${formatPostDate(post.published_at || post.created_at)}`;
  dialog.querySelector("#published-story-title").textContent = post.title;
  dialog.querySelector(".published-dialog-excerpt").textContent = post.excerpt;
  const body = dialog.querySelector(".published-dialog-body");
  body.replaceChildren();
  post.body.split(/\n{2,}/).filter(Boolean).forEach((paragraph) => {
    const element = document.createElement("p");
    element.textContent = paragraph;
    body.append(element);
  });
  const gallery = dialog.querySelector(".published-dialog-gallery");
  gallery.replaceChildren();
  for (const imageUrl of (post.image_paths || []).filter((url) => url !== post.cover_image_url)) {
    const imageElement = document.createElement("img");
    imageElement.src = normalizeMediaUrl(imageUrl);
    imageElement.alt = post.title;
    gallery.append(imageElement);
  }
  dialog.showModal();
}

function makeMediaCard(post, isReel) {
  const card = document.createElement("article");
  card.className = isReel ? "blog-reel-card" : "blog-video-card";
  const player = makeVideo(post);
  card.append(player);
  const type = document.createElement("p");
  type.className = "mono";
  type.textContent = `${isReel ? "REEL" : "VIDEO"} · ${formatPostDate(post.published_at || post.created_at)}`;
  const title = document.createElement("h3");
  title.textContent = post.title;
  card.append(type, title);
  if (post.excerpt) {
    const excerpt = document.createElement("p");
    excerpt.textContent = post.excerpt;
    card.append(excerpt);
  }
  return card;
}

async function renderBlog() {
  try {
    const posts = await loadPublishedPosts();
    const stories = posts.filter((post) => post.post_type === "story");
    const reels = posts.filter((post) => post.post_type === "reel");
    const videos = posts.filter((post) => post.post_type === "video");
    const storyGrid = document.querySelector("[data-blog-stories]");
    const reelGrid = document.querySelector("[data-blog-reels]");
    const videoGrid = document.querySelector("[data-blog-videos]");
    storyGrid.replaceChildren(...stories.map(makeStoryCard));
    reelGrid.replaceChildren(...reels.map((post) => makeMediaCard(post, true)));
    videoGrid.replaceChildren(...videos.map((post) => makeMediaCard(post, false)));
    setStatus(document.querySelector("[data-blog-stories-status]"), stories.length ? "" : "New field notes will appear here when published.");
    setStatus(document.querySelector("[data-blog-reels-status]"), reels.length ? "" : "New reels will appear here when published.");
    setStatus(document.querySelector("[data-blog-videos-status]"), videos.length ? "" : "New videos will appear here when published.");
    if (location.hash.startsWith("#story-")) {
      const post = stories.find((item) => `#story-${item.id}` === location.hash);
      if (post) openStory(post);
    }
  } catch (error) {
    for (const selector of ["[data-blog-stories-status]", "[data-blog-reels-status]", "[data-blog-videos-status]"]) {
      setStatus(document.querySelector(selector), `Blog content could not be loaded: ${error.message}`, true);
    }
  }
}

renderBlog();
