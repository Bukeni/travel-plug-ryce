import { deletePost, formatPostDate, getSupabase, isSupabaseConfigured, loadAdminPosts, savePost } from "./content-store.js";

const loginPanel = document.querySelector("[data-admin-login]");
const workspace = document.querySelector("[data-admin-workspace]");
const loginForm = document.querySelector("[data-login-form]");
const postForm = document.querySelector("[data-post-form]");
const passwordForm = document.querySelector("[data-password-form]");
const loginStatus = document.querySelector("[data-login-status]");
const adminStatus = document.querySelector("[data-admin-status]");
const passwordStatus = document.querySelector("[data-password-status]");
const postsContainer = document.querySelector("[data-admin-posts]");
const saveButton = document.querySelector("[data-save-post]");

function status(element, message, isError = false) {
  element.textContent = message;
  element.classList.toggle("is-error", isError);
  element.hidden = !message;
}

function showLogin(message, isError = false) {
  workspace.hidden = true;
  loginPanel.hidden = false;
  status(loginStatus, message, isError);
}

function showWorkspace() {
  loginPanel.hidden = true;
  workspace.hidden = false;
}

function setFieldsByType() {
  const isStory = postForm.elements.post_type.value === "story";
  postForm.querySelector("[data-body-field]").hidden = !isStory;
  postForm.querySelector("[data-video-field]").hidden = isStory;
  postForm.elements.body.required = isStory;
  postForm.elements.media_url.required = !isStory;
  postForm.elements.images.multiple = isStory;
  postForm.querySelector("[data-image-help]").textContent = isStory
    ? "Optional; first is the cover, the rest appear in the story. Up to 10 MB each"
    : "Optional cover image, up to 10 MB";
}

function resetEditor() {
  postForm.reset();
  postForm.elements.id.value = "";
  postForm.elements.cover_image_url.value = "";
  postForm.elements.image_paths.value = "[]";
  document.querySelector("[data-form-heading]").textContent = "Write a new post";
  document.querySelector("[data-cancel-edit]").hidden = true;
  saveButton.textContent = "SAVE DRAFT";
  setFieldsByType();
}

function beginEdit(post) {
  postForm.elements.id.value = post.id;
  postForm.elements.post_type.value = post.post_type;
  postForm.elements.title.value = post.title;
  postForm.elements.excerpt.value = post.excerpt || "";
  postForm.elements.body.value = post.body || "";
  postForm.elements.media_url.value = post.media_url || "";
  postForm.elements.cover_image_url.value = post.cover_image_url || "";
  postForm.elements.image_paths.value = JSON.stringify(post.image_paths || []);
  postForm.elements.images.value = "";
  postForm.elements.status.value = post.is_published ? "published" : "draft";
  document.querySelector("[data-form-heading]").textContent = "Edit post";
  document.querySelector("[data-cancel-edit]").hidden = false;
  setFieldsByType();
  postForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderPosts(posts) {
  postsContainer.replaceChildren();
  if (!posts.length) {
    const empty = document.createElement("p");
    empty.className = "admin-empty";
    empty.textContent = "No posts yet. Add your first story, reel, or video.";
    postsContainer.append(empty);
    return;
  }
  for (const post of posts) {
    const row = document.createElement("article");
    row.className = "admin-post-row";
    const heading = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = post.title;
    const meta = document.createElement("p");
    meta.className = "mono";
    meta.textContent = `${post.post_type.toUpperCase()} · ${post.is_published ? "PUBLISHED" : "DRAFT"} · ${formatPostDate(post.published_at || post.created_at)}`;
    heading.append(title, meta);
    const actions = document.createElement("div");
    actions.className = "admin-post-actions";
    const edit = document.createElement("button");
    edit.type = "button";
    edit.className = "admin-secondary-button";
    edit.textContent = "EDIT";
    edit.addEventListener("click", () => beginEdit(post));
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "admin-secondary-button is-danger";
    remove.textContent = "DELETE";
    remove.addEventListener("click", async () => {
      if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
      remove.disabled = true;
      try {
        await deletePost(post.id);
        const refreshed = await refreshPosts();
        if (postForm.elements.id.value === post.id) resetEditor();
        if (refreshed) status(adminStatus, "Post deleted.");
      } catch (error) {
        status(adminStatus, `Post could not be deleted: ${error.message}`, true);
        remove.disabled = false;
      }
    });
    actions.append(edit, remove);
    row.append(heading, actions);
    postsContainer.append(row);
  }
}

async function refreshPosts() {
  status(adminStatus, "Loading posts…");
  try {
    renderPosts(await loadAdminPosts());
    status(adminStatus, "");
    return true;
  } catch (error) {
    status(adminStatus, `Posts could not be loaded: ${error.message}`, true);
    return false;
  }
}

async function enterWorkspace(user) {
  const { data, error } = await getSupabase()
    .from("content_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) throw error;
  if (!data) {
    await getSupabase().auth.signOut();
    showLogin("This account has not been approved for editor access.", true);
    return;
  }
  showWorkspace();
  await refreshPosts();
}

document.querySelector("[data-password-login]").addEventListener("click", async (event) => {
  const button = event.currentTarget;
  const email = loginForm.elements.email.value.trim();
  const password = loginForm.elements.password.value;
  if (!password) {
    status(loginStatus, "Enter your password, or request a one-time login link.", true);
    return;
  }
  button.disabled = true;
  status(loginStatus, "Signing in…");
  try {
    const { error } = await getSupabase().auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    const { data, error: userError } = await getSupabase().auth.getUser();
    if (userError) throw userError;
    await enterWorkspace(data.user);
  } catch (error) {
    showLogin(`Sign-in failed: ${error.message}`, true);
  } finally {
    button.disabled = false;
  }
});

document.querySelector("[data-email-link]").addEventListener("click", async (event) => {
  const button = event.currentTarget;
  const email = loginForm.elements.email.value.trim();
  if (!loginForm.elements.email.reportValidity()) return;
  button.disabled = true;
  status(loginStatus, "Sending a secure sign-in link…");
  try {
    const { error } = await getSupabase().auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: new URL("admin.html", window.location.href).href
      }
    });
    if (error) throw error;
    status(loginStatus, "If this email belongs to an approved admin account, a one-time sign-in link has been sent.");
  } catch (error) {
    status(loginStatus, `A sign-in link could not be sent: ${error.message}`, true);
  } finally {
    button.disabled = false;
  }
});

passwordForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const password = passwordForm.elements.password.value;
  if (password.length < 12) {
    status(passwordStatus, "Use at least 12 characters for your password.", true);
    return;
  }
  if (password !== passwordForm.elements.confirm_password.value) {
    status(passwordStatus, "The passwords do not match.", true);
    return;
  }
  const button = passwordForm.querySelector("button[type=submit]");
  button.disabled = true;
  status(passwordStatus, "Saving password…");
  try {
    const { error } = await getSupabase().auth.updateUser({ password });
    if (error) throw error;
    passwordForm.reset();
    status(passwordStatus, "Password saved. You can now sign in with your email and password.");
  } catch (error) {
    status(passwordStatus, `Password could not be saved: ${error.message}`, true);
  } finally {
    button.disabled = false;
  }
});

postForm.elements.post_type.addEventListener("change", () => {
  postForm.elements.images.value = "";
  setFieldsByType();
});
document.querySelector("[data-cancel-edit]").addEventListener("click", resetEditor);
document.querySelector("[data-refresh-posts]").addEventListener("click", refreshPosts);
document.querySelector("[data-sign-out]").addEventListener("click", async () => {
  try {
    const { error } = await getSupabase().auth.signOut();
    if (error) throw error;
    resetEditor();
    showLogin("You have signed out.");
  } catch (error) {
    status(adminStatus, `Could not sign out: ${error.message}`, true);
  }
});

postForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  saveButton.disabled = true;
  status(adminStatus, "Saving post…");
  const fields = Object.fromEntries(new FormData(postForm));
  fields.status = postForm.elements.status.value;
  try {
    await savePost(fields, postForm.elements.images.files);
    resetEditor();
    if (await refreshPosts()) {
      status(adminStatus, fields.status === "published" ? "Post published." : "Draft saved.");
    }
  } catch (error) {
    status(adminStatus, `Post could not be saved: ${error.message}`, true);
  } finally {
    saveButton.disabled = false;
  }
});

postForm.elements.status.addEventListener("change", (event) => {
  saveButton.textContent = event.target.value === "published" ? "PUBLISH POST" : "SAVE DRAFT";
});

async function start() {
  if (!isSupabaseConfigured()) {
    showLogin("Publishing is not configured yet. Follow the setup steps in SUPABASE_SETUP.md.", true);
    loginForm.querySelectorAll("input, button").forEach((element) => { element.disabled = true; });
    return;
  }
  try {
    const { data, error } = await getSupabase().auth.getSession();
    if (error) throw error;
    if (data.session) await enterWorkspace(data.session.user);
    else showLogin("");
  } catch (error) {
    showLogin(`Editor access could not be checked: ${error.message}`, true);
  }
}

setFieldsByType();
start();
