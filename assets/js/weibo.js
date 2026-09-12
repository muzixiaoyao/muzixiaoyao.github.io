(() => {
  const page = document.querySelector(".weibo-page[data-supabase-url]");
  const form = document.querySelector("[data-weibo-composer]");
  const input = document.querySelector("#weibo-input");
  const counter = document.querySelector("[data-weibo-counter]");
  const help = document.querySelector("[data-weibo-help]");
  const feed = document.querySelector(".weibo-feed");
  const authControls = document.querySelector("[data-weibo-auth-controls]");
  const authStatus = document.querySelector("[data-weibo-auth-status]");
  const loginToggle = document.querySelector("[data-weibo-login-toggle]");
  const logoutButton = document.querySelector("[data-weibo-logout]");
  const loginPanel = document.querySelector("[data-weibo-login-panel]");
  const loginForm = document.querySelector("[data-weibo-login-form]");
  const authMessage = document.querySelector("[data-weibo-auth-message]");
  const submitButton = form?.querySelector("button[type=submit]");

  if (!page || !form || !input || !counter || !help || !feed) return;

  const url = page.dataset.supabaseUrl?.trim();
  const anonKey = page.dataset.supabaseAnonKey?.trim();
  const configured = page.dataset.supabaseEnabled === "true" && Boolean(url && anonKey && window.supabase?.createClient);
  let client = null;
  let session = null;

  const setMessage = (message, error = false) => {
    if (!authMessage) return;
    authMessage.textContent = message;
    authMessage.dataset.error = error ? "true" : "false";
  };

  const formatDate = (value) => new Intl.DateTimeFormat("zh-CN", {
    year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit"
  }).format(new Date(value));

  const makeElement = (tag, className, text = "") => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  };

  const renderLivePost = (item) => {
    const article = makeElement("article", "weibo-post weibo-live-post");
    article.id = `remote-${item.id}`;

    const head = makeElement("div", "weibo-post-head");
    const avatar = makeElement("img", "weibo-post-avatar");
    avatar.src = "/img/avatar.svg";
    avatar.alt = "木子逍遥";
    head.append(avatar);

    const author = makeElement("div", "weibo-post-author");
    author.append(makeElement("strong", "", "木子逍遥"));
    const time = makeElement("time", "", formatDate(item.created_at));
    time.dateTime = item.created_at;
    author.append(time);
    head.append(author);
    article.append(head);

    const content = makeElement("div", "weibo-post-content weibo-live-content", item.content || "");
    article.append(content);

    const footer = makeElement("footer", "weibo-post-footer");
    if (item.mood) footer.append(makeElement("span", "", `◌ ${item.mood}`));
    if (item.location) footer.append(makeElement("span", "", `⌖ ${item.location}`));
    (item.tags || []).forEach((tag) => footer.append(makeElement("span", "weibo-live-tag", `#${tag}`)));
    if (session && item.author_id === session.user.id) {
      const deleteButton = makeElement("button", "weibo-delete-button", "删除");
      deleteButton.type = "button";
      deleteButton.addEventListener("click", async () => {
        if (!window.confirm("确定删除这条动态吗？删除后无法恢复。")) return;
        deleteButton.disabled = true;
        deleteButton.textContent = "删除中";
        const { error } = await client.from("weibo_posts")
          .delete()
          .eq("id", item.id)
          .eq("author_id", session.user.id);
        if (error) {
          deleteButton.disabled = false;
          deleteButton.textContent = "删除";
          setMessage(`删除失败：${error.message}`, true);
          return;
        }
        article.remove();
        setMessage("动态已删除");
        if (!feed.querySelector(".weibo-live-post")) showEmptyFeed();
      });
      footer.append(deleteButton);
    }
    article.append(footer);
    return article;
  };

  const showEmptyFeed = () => {
    feed.replaceChildren(makeElement("div", "weibo-empty", "还没有动态，写下第一条吧。"));
  };

  const loadPosts = async () => {
    if (!client) return;
    const { data, error } = await client.from("weibo_posts")
      .select("id, author_id, content, mood, location, tags, created_at")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) {
      setMessage(`动态读取失败：${error.message}`, true);
      return;
    }
    feed.replaceChildren(...(data || []).map(renderLivePost));
    if (!data?.length) showEmptyFeed();
  };

  const updateAuthUI = (nextSession) => {
    session = nextSession;
    if (!configured) return;
    authControls.hidden = false;
    loginToggle.hidden = Boolean(session);
    logoutButton.hidden = !session;
    loginPanel.hidden = Boolean(session) || loginPanel.dataset.open !== "true";
    authStatus.textContent = session ? `已登录：${session.user.email}` : "未登录";
    input.disabled = !session;
    submitButton.disabled = !session;
    submitButton.title = session ? "发布动态" : "请先登录";
    input.placeholder = session ? "有什么新鲜事想分享？" : "请先登录后发布动态";
  };

  input.addEventListener("input", () => { counter.textContent = `${input.value.length} / 280`; });

  if (!configured) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      help.hidden = false;
      input.blur();
    });
    return;
  }

  client = window.supabase.createClient(url, anonKey);
  updateAuthUI(null);
  loadPosts();

  client.auth.getSession().then(({ data }) => {
    updateAuthUI(data.session);
    loadPosts();
  });
  client.auth.onAuthStateChange((_event, nextSession) => {
    updateAuthUI(nextSession);
    loadPosts();
  });

  loginToggle.addEventListener("click", () => {
    loginPanel.dataset.open = "true";
    loginPanel.hidden = false;
    document.querySelector("#weibo-email")?.focus();
  });

  logoutButton.addEventListener("click", async () => {
    const { error } = await client.auth.signOut();
    if (error) setMessage(error.message, true);
  });

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setMessage("登录中……");
    const email = document.querySelector("#weibo-email").value.trim();
    const password = document.querySelector("#weibo-password").value;
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message, true);
    else { setMessage("登录成功"); loginPanel.dataset.open = "false"; }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const content = input.value.trim();
    if (!session) {
      loginPanel.dataset.open = "true";
      loginPanel.hidden = false;
      setMessage("请先登录后发布动态");
      return;
    }
    if (!content) return;
    submitButton.disabled = true;
    submitButton.textContent = "发布中";
    const { error } = await client.from("weibo_posts").insert({
      author_id: session.user.id,
      content,
      tags: []
    });
    submitButton.disabled = false;
    submitButton.textContent = "发布";
    if (error) {
      setMessage(`发布失败：${error.message}`, true);
      return;
    }
    input.value = "";
    counter.textContent = "0 / 280";
    setMessage("发布成功");
    await loadPosts();
  });
})();
