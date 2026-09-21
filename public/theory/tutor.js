/* Anchored tutor notes. A question can be asked at any paragraph, box, figure or
   exercise; the thread stays pinned there and is kept in this browser.
   Answers need an Anthropic API key, which is stored in this browser only and
   sent directly to api.anthropic.com from this page. Without a key every note
   still works as a private written note. */
(() => {
  "use strict";
  /* Three ways to connect. "gateway" is for a local or self-hosted proxy that
     holds the credentials itself — the browser stores no key and may send its
     session cookies instead. */
  const PROVIDERS = {
    anthropic: {
      label: "Claude (Anthropic API)",
      base: "https://api.anthropic.com",
      models: ["claude-opus-5", "claude-sonnet-5", "claude-haiku-4-5"],
      wire: "anthropic"
    },
    openai: {
      label: "OpenAI API",
      base: "https://api.openai.com",
      models: [],
      wire: "openai"
    },
    gateway: {
      label: "Local gateway — it holds the credentials",
      base: "http://localhost:8787",
      models: [],
      wire: "anthropic"
    }
  };
  const CONNECTION_STORE = "tutor:connection";
  const DEFAULT_CONNECTION = {
    provider: "anthropic",
    base: PROVIDERS.anthropic.base,
    model: PROVIDERS.anthropic.models[0],
    key: "",
    wire: "anthropic",
    cookies: false
  };

  const TUTOR_BRIEF = [
    "You are the tutor for a rigorous, ground-up mathematics-for-machine-learning course, answering a question the student raised at one specific point on a lesson page.",
    "The student is an experienced engineer working toward research-engineer-level fluency. Assume real mathematical maturity but do not assume they remember the prerequisites. Be exact; never hand-wave a definition.",
    "House style: answer in 3-8 sentences unless the student asks for more. Lead with the answer, then the reason. Plain prose with unicode math (R^n, <=, !=, sum, ||v||, <u,v>, 0 for the zero vector) — never LaTeX, never markdown headings, never bullet lists longer than four items.",
    "If the question is about an exercise, give a hint or the first move and stop; give the full solution only when the student asks again or has clearly attempted it. If they show work, say precisely where the argument leaks rather than only whether it is right.",
    "If the student is wrong, say so directly and show the counterexample. Do not pad with praise.",
    "You cannot see the page beyond the passage quoted below. Do not invent lesson content."
  ].join("\n");

  const GRADE_BRIEF = [
    "GRADING MODE. The student is submitting an attempt, not asking a question. Do NOT restate the problem and do NOT give a model solution up front.",
    "Answer in this order, compactly: (1) a one-line verdict — correct / correct but incomplete / wrong; (2) the first place the argument actually fails or a step is unjustified, quoted from their words, with the specific counterexample or missing case; (3) one sentence on what to fix. If it is fully correct, say so plainly and name the one step that carried the proof — do not invent a flaw to seem rigorous.",
    "Be strict about what is usually waved through: dividing by a coefficient without asserting it is nonzero; proving one direction of an 'if and only if'; asserting a set is a subspace without checking all three conditions; confusing 'no vector is a multiple of another' with independence for more than two vectors; using a result from a later lesson.",
    "Do not reveal the full solution unless the attempt is essentially complete or the student asks for it."
  ].join("\n");

  const memory = new Map();
  const read = key => { try { return localStorage.getItem(key) || ""; } catch { return memory.get(key) || ""; } };
  const write = (key, value) => { memory.set(key, value); try { localStorage.setItem(key, value); return true; } catch { return false; } };
  const drop = key => { memory.delete(key); try { localStorage.removeItem(key); } catch {} };

  const escapeHTML = text => String(text).replace(/[&<>"']/g, c =>
    ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}[c]));
  const lightMarkup = text => escapeHTML(text)
    .replace(/`([^`\n]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");

  function hash(text) {
    let value = 5381;
    for (let i = 0; i < text.length; i++) value = ((value * 33) ^ text.charCodeAt(i)) >>> 0;
    return "a" + value.toString(36);
  }

  function connection() {
    let stored = {};
    try { stored = JSON.parse(read(CONNECTION_STORE) || "{}") || {}; } catch { stored = {}; }
    return Object.assign({}, DEFAULT_CONNECTION, stored);
  }
  function saveConnection(next) { write(CONNECTION_STORE, JSON.stringify(next)); }
  function connected() {
    const current = connection();
    if (!current.base) return false;
    return current.provider === "gateway" ? true : !!current.key;
  }

  let lessonPath = "", notes = {}, slots = {}, cards = {};
  const storeKey = () => "tutor:notes:" + lessonPath;

  function load() {
    notes = {};
    try { notes = JSON.parse(read(storeKey()) || "{}") || {}; } catch { notes = {}; }
  }
  function persist() { write(storeKey(), JSON.stringify(notes)); }

  const ANCHORS = "#article > p, #article > h2, #article > h3, #article > blockquote, " +
                  "#article > table, #article > ul, #article > ol, #article > .lab, #article > .ex, #article > details, " +
                  "#article .practice-row > p";

  function titleOf(node) {
    const practiceRow = node.parentElement && node.parentElement.classList.contains("practice-row")
      ? node.parentElement : null;
    if (practiceRow) {
      const level = practiceRow.querySelector(".ex-tag");
      const text = (node.innerText || "").replace(/\s+/g, " ").trim();
      return "Practice" + (level ? " · " + level.textContent : "") + " — " + text.slice(0, 54) +
             (text.length > 54 ? "…" : "");
    }
    if (node.classList.contains("ex")) {
      const head = node.querySelector(".ex-h");
      return "Exercise " + (head ? head.textContent : "");
    }
    if (node.classList.contains("lab")) {
      const title = node.querySelector(".lab-title");
      return "Figure: " + (title ? title.textContent : "interactive");
    }
    const text = (node.innerText || "").replace(/\s+/g, " ").trim();
    return text.slice(0, 68) + (text.length > 68 ? "…" : "");
  }
  function excerptOf(node) {
    if (node.classList.contains("lab")) {
      const title = node.querySelector(".lab-title"), hint = node.querySelector(".lab-hint");
      return "A draggable figure in the lesson — " + (title ? title.textContent : "") +
             (hint ? " (" + hint.textContent + ")" : "") + ".";
    }
    return (node.innerText || "").replace(/\s+/g, " ").trim().slice(0, 900);
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function install() {
    slots = {}; cards = {};
    const used = {};
    document.querySelectorAll(ANCHORS).forEach(node => {
      if (node.closest(".gu-note")) return;
      const text = (node.innerText || "").replace(/\s+/g, " ").trim();
      if (text.length < 24 && !node.classList.contains("lab")) return;
      let id = hash(text.slice(0, 120) + "|" + node.tagName);
      while (used[id]) id += "x";
      used[id] = true;
      const title = titleOf(node), excerpt = excerptOf(node);
      node.classList.add("anch");
      if (node.tagName !== "P" && node.tagName !== "H2" && node.tagName !== "H3") node.classList.add("anch-block");
      const chip = element("button", "askchip", "?");
      chip.type = "button";
      chip.title = "Ask about this";
      chip.setAttribute("aria-label", "Ask a question about: " + title);
      chip.onclick = event => {
        event.preventDefault();
        const selection = String(window.getSelection ? window.getSelection() : "").trim();
        const scoped = selection.length > 12 && window.getSelection().anchorNode &&
                       node.contains(window.getSelection().anchorNode) ? selection : null;
        open(id, scoped);
      };
      node.appendChild(chip);
      if (node.parentElement && node.parentElement.classList.contains("practice-row") &&
          !node.parentElement.querySelector(".practice-hint")) {
        const hint = element("button", "hintchip", "hint");
        hint.type = "button";
        hint.title = "Ask for the first move, not the answer";
        hint.onclick = event => {
          event.preventDefault();
          const card = ensureCard(id);
          if (!card) return;
          card.hidden = false;
          renderThread(id);
          const box = card.querySelector("textarea");
          box.value = "Give me a hint for this practice prompt — the first move only, not the answer. " +
                      "If I am meant to construct something, say what shape it should have.";
          card.scrollIntoView({behavior: "smooth", block: "nearest"});
          if (connected() && card._submit) card._submit("ask"); else box.focus();
        };
        node.appendChild(hint);
      }
      const head = node.classList.contains("ex") ? node.querySelector(".ex-h") : null;
      const exercise = head ? head.textContent.trim().split(/[\s·]/)[0] : null;
      slots[id] = {node, chip, title, excerpt, exercise};
    });
    refreshRail();
  }

  function ensureCard(id) {
    if (cards[id]) return cards[id];
    const slot = slots[id];
    if (!slot) return null;
    const card = element("div", "gu-note");
    card.id = "note-" + id;
    card.innerHTML =
      '<div class="note-h"><span class="lbl">Note</span><span class="exc"></span>' +
      '<button type="button" class="close" title="Close (the thread is kept)">×</button></div>' +
      '<div class="note-thread"></div>' +
      '<div class="note-compose">' +
      '<textarea rows="3" placeholder="Ask about this passage, or write your attempt…"></textarea>' +
      '<div class="note-actions">' +
      '<button type="button" class="primary send">Ask Claude</button>' +
      '<button type="button" class="grade">Grade my attempt</button>' +
      '<button type="button" class="stop" hidden>Stop</button>' +
      '<button type="button" class="settings">Key</button>' +
      '<span class="note-status"></span></div></div>';
    card.querySelector(".exc").textContent = slot.title;
    card.querySelector(".close").onclick = () => { card.hidden = true; };
    slot.node.insertAdjacentElement("afterend", card);
    cards[id] = card;
    wire(id);
    syncLabels();
    return card;
  }

  function renderThread(id) {
    const card = cards[id];
    if (!card) return;
    const thread = card.querySelector(".note-thread");
    thread.replaceChildren();
    ((notes[id] || {}).turns || []).forEach(turn => {
      const row = element("div", "turn " + (turn.role === "user" ? "me" : "cl"));
      row.innerHTML = '<span class="who">' + (turn.role === "user" ? "You" : "Claude") +
                      '</span><div class="body">' + lightMarkup(turn.text) + "</div>";
      thread.append(row);
    });
  }

  function refreshRail() {
    const rail = document.getElementById("guRail");
    if (!rail) return;
    const ids = Object.keys(notes).filter(id => (notes[id].turns || []).length);
    document.getElementById("guCount").textContent = ids.length;
    document.getElementById("guWord").textContent = ids.length === 1 ? "note" : "notes";
    rail.hidden = false;
    const list = document.getElementById("guList");
    const tools = list.querySelector(".list-tools");
    list.replaceChildren();
    if (!ids.length) {
      const empty = element("p", "list-empty", "No notes yet — the ? at the edge of any block starts one.");
      list.append(empty);
    }
    ids.sort((a, b) => (notes[b].updated || 0) - (notes[a].updated || 0)).forEach(id => {
      const link = element("a", null, notes[id].title || id);
      link.href = "#note-" + id;
      link.onclick = event => {
        event.preventDefault();
        const card = ensureCard(id);
        if (!card) return;
        card.hidden = false;
        renderThread(id);
        card.scrollIntoView({behavior: "smooth", block: "center"});
        card.classList.remove("flash");
        void card.offsetWidth;
        card.classList.add("flash");
        list.hidden = true;
      };
      list.append(link);
    });
    if (tools) list.append(tools);
    Object.keys(slots).forEach(id => {
      slots[id].chip.classList.toggle("has", !!((notes[id] || {}).turns || []).length);
    });
  }

  function open(id, selection) {
    const card = ensureCard(id);
    if (!card) return;
    card.hidden = false;
    renderThread(id);
    card.scrollIntoView({behavior: "smooth", block: "nearest"});
    const box = card.querySelector("textarea");
    if (selection && !box.value) box.value = 'About "' + selection.slice(0, 180) + '": ';
    setTimeout(() => box.focus(), 150);
  }

  function syncLabels() {
    const live = connected();
    Object.values(cards).forEach(card => {
      card.querySelector(".send").textContent = live ? "Ask" : "Save note";
      card.querySelector(".grade").hidden = !live;
    });
    const button = document.getElementById("tutor-connect");
    if (button) {
      const current = connection();
      button.textContent = live
        ? (current.provider === "gateway" ? "Connected · gateway" : "Connected · " + (current.model || current.provider))
        : "Connect a model";
    }
  }

  function setStatus(card, message, isError) {
    const status = card.querySelector(".note-status");
    status.textContent = message || "";
    status.classList.toggle("err", !!isError);
  }

  /* ---------- connection dialog ---------- */
  function openDialog() {
    const dialog = document.getElementById("gu-modal");
    if (!dialog) return;
    const current = connection();
    dialog.querySelector("#tutor-provider").value = current.provider;
    dialog.querySelector("#tutor-base").value = current.base;
    dialog.querySelector("#tutor-model").value = current.model || "";
    dialog.querySelector("#tutor-key").value = current.key || "";
    dialog.querySelector("#tutor-wire").value = current.wire;
    dialog.querySelector("#tutor-cookies").checked = !!current.cookies;
    reflectProvider();
    if (typeof dialog.showModal === "function") dialog.showModal(); else dialog.hidden = false;
  }

  function reflectProvider() {
    const dialog = document.getElementById("gu-modal");
    const provider = dialog.querySelector("#tutor-provider").value;
    const spec = PROVIDERS[provider] || PROVIDERS.anthropic;
    dialog.querySelectorAll("[data-only]").forEach(node => {
      node.hidden = !node.dataset.only.split(" ").includes(provider);
    });
    const base = dialog.querySelector("#tutor-base");
    if (!base.dataset.touched) base.value = spec.base;
    const model = dialog.querySelector("#tutor-model");
    model.placeholder = spec.models.length ? spec.models[0] : "model name used by your endpoint";
    const list = dialog.querySelector("#tutor-model-options");
    list.replaceChildren();
    spec.models.forEach(name => {
      const option = element("option", null, "");
      option.value = name;
      list.append(option);
    });
    if (provider !== "gateway") dialog.querySelector("#tutor-wire").value = spec.wire;
  }

  function buildDialog() {
    if (document.getElementById("gu-modal")) return;
    const dialog = document.createElement("dialog");
    dialog.id = "gu-modal";
    dialog.className = "gu-modal";
    dialog.innerHTML =
      '<form method="dialog">' +
      '<h2>Connect a model</h2>' +
      '<p class="fine">Answers are requested straight from this page. A key typed here is stored in this browser only and never leaves it except as the request header to the endpoint below. Prefer the gateway option if you would rather no key sat in browser storage.</p>' +
      '<label for="tutor-provider">Provider</label>' +
      '<select id="tutor-provider"></select>' +
      '<label for="tutor-base">Endpoint base URL</label>' +
      '<input id="tutor-base" type="url" spellcheck="false" autocomplete="off">' +
      '<label for="tutor-model">Model</label>' +
      '<input id="tutor-model" list="tutor-model-options" spellcheck="false" autocomplete="off">' +
      '<datalist id="tutor-model-options"></datalist>' +
      '<div data-only="anthropic openai"><label for="tutor-key">API key</label>' +
      '<input id="tutor-key" type="password" spellcheck="false" autocomplete="off" placeholder="stored in this browser only"></div>' +
      '<div data-only="gateway"><label for="tutor-wire">Request format your gateway speaks</label>' +
      '<select id="tutor-wire"><option value="anthropic">Anthropic Messages API</option>' +
      '<option value="openai">OpenAI chat completions</option></select>' +
      '<label class="inline"><input type="checkbox" id="tutor-cookies"> Send this browser\u2019s cookies (for a gateway behind your own sign-in)</label></div>' +
      '<div class="gu-modal-actions">' +
      '<button value="cancel" class="ghost">Cancel</button>' +
      '<button value="clear" class="ghost">Disconnect</button>' +
      '<button value="save" class="primary">Save</button>' +
      '</div></form>';
    document.body.append(dialog);

    const provider = dialog.querySelector("#tutor-provider");
    Object.keys(PROVIDERS).forEach(name => {
      const option = element("option", null, PROVIDERS[name].label);
      option.value = name;
      provider.append(option);
    });
    provider.onchange = () => { dialog.querySelector("#tutor-base").dataset.touched = ""; reflectProvider(); };
    dialog.querySelector("#tutor-base").oninput = event => { event.target.dataset.touched = "yes"; };
    dialog.addEventListener("close", () => {
      if (dialog.returnValue === "save") {
        const chosen = provider.value;
        saveConnection({
          provider: chosen,
          base: dialog.querySelector("#tutor-base").value.trim().replace(/\/+$/, ""),
          model: dialog.querySelector("#tutor-model").value.trim(),
          key: chosen === "gateway" ? "" : dialog.querySelector("#tutor-key").value.trim(),
          wire: chosen === "gateway" ? dialog.querySelector("#tutor-wire").value : PROVIDERS[chosen].wire,
          cookies: chosen === "gateway" && dialog.querySelector("#tutor-cookies").checked
        });
      } else if (dialog.returnValue === "clear") {
        drop(CONNECTION_STORE);
      }
      syncLabels();
    });
  }

  /* ---------- the request ---------- */
  async function ask(brief, turns, signal) {
    const current = connection();
    if (!current.model) throw new Error("No model name is set. Open Connect a model and name one.");
    const headers = {"content-type": "application/json"};
    let url, body;
    if (current.wire === "openai") {
      url = current.base + "/v1/chat/completions";
      if (current.key) headers.authorization = "Bearer " + current.key;
      body = {
        model: current.model,
        messages: [{role: "system", content: brief}].concat(
          turns.map(turn => ({role: turn.role, content: turn.text})))
      };
    } else {
      url = current.base + "/v1/messages";
      if (current.key) headers["x-api-key"] = current.key;
      headers["anthropic-version"] = "2023-06-01";
      headers["anthropic-dangerous-direct-browser-access"] = "true";
      body = {
        model: current.model,
        max_tokens: 4000,
        output_config: {effort: "medium"},
        system: brief,
        messages: turns.map(turn => ({role: turn.role, content: turn.text}))
      };
    }
    const response = await fetch(url, {
      method: "POST",
      signal,
      headers,
      credentials: current.cookies ? "include" : "same-origin",
      body: JSON.stringify(body)
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const detail = (payload.error && (payload.error.message || payload.error.type)) || ("HTTP " + response.status);
      if (response.status === 401 || response.status === 403) throw new Error("The endpoint rejected these credentials. Open Connect a model.");
      if (response.status === 429) throw new Error("Rate limited by the endpoint. Try again shortly.");
      throw new Error(detail);
    }
    if (payload.stop_reason === "refusal") throw new Error("The model declined to answer that one.");
    const text = current.wire === "openai"
      ? ((payload.choices || [])[0] || {}).message && payload.choices[0].message.content || ""
      : (payload.content || []).filter(block => block.type === "text").map(block => block.text).join("\n");
    if (!String(text).trim()) throw new Error("No answer came back. Try rephrasing.");
    return String(text).trim();
  }

  function wire(id) {
    const card = cards[id];
    const box = card.querySelector("textarea");
    const send = card.querySelector(".send");
    const grade = card.querySelector(".grade");
    const stop = card.querySelector(".stop");
    let controller = null;

    card.querySelector(".settings").onclick = () => openDialog();

    async function submit(mode) {
      let question = box.value.trim();
      if (!question) return;
      if (mode === "grade") question = "MY ATTEMPT — mark it:\n\n" + question;
      const slot = slots[id];
      notes[id] = notes[id] || {title: slot.title, excerpt: slot.excerpt, turns: []};
      notes[id].title = slot.title;
      notes[id].excerpt = slot.excerpt;
      notes[id].turns.push({role: "user", text: question, ts: Date.now()});
      notes[id].updated = Date.now();
      box.value = "";
      renderThread(id); refreshRail(); persist();

      if (!connected()) {
        setStatus(card, "Saved as a note. Use Connect to get answers here.");
        return;
      }

      const bubble = element("div", "turn cl");
      bubble.innerHTML = '<span class="who">Claude</span><div class="body">Thinking…</div>';
      card.querySelector(".note-thread").append(bubble);

      send.disabled = true; grade.disabled = true; stop.hidden = false;
      setStatus(card, "");
      controller = new AbortController();
      try {
        const brief = TUTOR_BRIEF + (mode === "grade" ? "\n\n" + GRADE_BRIEF : "") +
          '\n\nTHE PASSAGE THE STUDENT IS ASKING ABOUT ("' + slot.title + '"):\n' + slot.excerpt;
        const text = await ask(brief, notes[id].turns, controller.signal);
        notes[id].turns.push({role: "assistant", text, ts: Date.now()});
        notes[id].updated = Date.now();
        renderThread(id); refreshRail(); persist();
      } catch (error) {
        bubble.remove();
        setStatus(card, error.name === "AbortError" ? "Stopped." : error.message, error.name !== "AbortError");
      } finally {
        send.disabled = false; grade.disabled = false; stop.hidden = true; controller = null;
      }
    }

    card._submit = submit;
    send.onclick = () => submit("ask");
    grade.onclick = () => submit("grade");
    stop.onclick = () => { if (controller) controller.abort(); };
    box.addEventListener("keydown", event => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") { event.preventDefault(); submit("ask"); }
    });
  }

  /* ---------- backup ---------- */
  const WORK_KEY = "gu.work.v1";
  function collect() {
    const bundle = {version: 1, exported: new Date().toISOString(), notes: {}, lessonNotes: {}, work: {}};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith("tutor:notes:")) bundle.notes[key.slice("tutor:notes:".length)] = JSON.parse(localStorage.getItem(key) || "{}");
        else if (key.startsWith("notes:")) bundle.lessonNotes[key.slice("notes:".length)] = localStorage.getItem(key);
      }
      bundle.work = JSON.parse(localStorage.getItem(WORK_KEY) || "{}");
    } catch {}
    return bundle;
  }
  function exportAll() {
    const blob = new Blob([JSON.stringify(collect(), null, 2)], {type: "application/json"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "groundup-notes-" + new Date().toISOString().slice(0, 10) + ".json";
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 4000);
  }
  function merge(bundle) {
    if (!bundle || typeof bundle !== "object") throw new Error("not a backup file");
    const incomingNotes = bundle.notes || {};
    Object.keys(incomingNotes).forEach(path => {
      let current = {};
      try { current = JSON.parse(read("tutor:notes:" + path) || "{}"); } catch {}
      const incoming = incomingNotes[path] || {};
      Object.keys(incoming).forEach(id => {
        const mine = current[id], theirs = incoming[id];
        if (!mine || (theirs.updated || 0) > (mine.updated || 0)) current[id] = theirs;
      });
      write("tutor:notes:" + path, JSON.stringify(current));
    });
    Object.keys(bundle.lessonNotes || {}).forEach(path => {
      if (!read("notes:" + path)) write("notes:" + path, bundle.lessonNotes[path]);
    });
    if (bundle.work) {
      let work = {};
      try { work = JSON.parse(read(WORK_KEY) || "{}"); } catch {}
      Object.keys(bundle.work).forEach(page => {
        work[page] = Object.assign({}, work[page] || {}, bundle.work[page]);
      });
      write(WORK_KEY, JSON.stringify(work));
    }
    load();
    refreshRail();
  }
  function importAll() {
    const picker = document.createElement("input");
    picker.type = "file";
    picker.accept = "application/json,.json";
    picker.onchange = () => {
      const file = picker.files && picker.files[0];
      if (!file) return;
      file.text().then(text => {
        merge(JSON.parse(text));
        window.location.reload();
      }).catch(error => window.alert("Could not import that file: " + error.message));
    };
    picker.click();
  }

  function buildRail() {
    if (document.getElementById("guRail")) return;
    const rail = element("div", null);
    rail.id = "guRail";
    rail.hidden = true;
    rail.innerHTML =
      '<div id="guList" hidden><div class="list-tools">' +
      '<button type="button" class="mini" id="guExport">Export notes</button>' +
      '<button type="button" class="mini" id="guImport">Import</button></div></div>' +
      '<button class="pill" id="guPill" type="button" aria-expanded="false">' +
      '<span class="n" id="guCount">0</span> <span id="guWord">notes</span></button>';
    document.body.append(rail);
    const list = document.getElementById("guList"), pill = document.getElementById("guPill");
    pill.onclick = () => { list.hidden = !list.hidden; pill.setAttribute("aria-expanded", String(!list.hidden)); };
    document.getElementById("guExport").onclick = exportAll;
    document.getElementById("guImport").onclick = importAll;
  }

  function buildSettings(host) {
    if (!host || document.getElementById("tutor-connect")) return;
    const button = document.createElement("button");
    button.id = "tutor-connect";
    button.type = "button";
    button.className = "tutor-connect";
    button.onclick = () => openDialog();
    host.append(button);
  }

  /* Every exchange with the model is kept as a note, anchored where it happened:
     questions land on the passage, markings land on the exercise. */
  function anchorForExercise(exercise) {
    return Object.keys(slots).find(id => slots[id].exercise === exercise) || null;
  }
  function appendTurns(anchorId, turns) {
    const slot = slots[anchorId];
    if (!slot) return;
    notes[anchorId] = notes[anchorId] || {title: slot.title, excerpt: slot.excerpt, turns: []};
    notes[anchorId].title = slot.title;
    notes[anchorId].excerpt = slot.excerpt;
    turns.forEach(turn => notes[anchorId].turns.push({role: turn.role, text: turn.text, ts: Date.now()}));
    notes[anchorId].updated = Date.now();
    persist();
    if (cards[anchorId]) renderThread(anchorId);
    refreshRail();
  }

  /* The answer checker asks the page to mark written work; route it through the
     same connection the notes use. */
  window.GU_BRIEF = TUTOR_BRIEF;
  window.GU_GRADE_BRIEF = GRADE_BRIEF;
  window.GU_MARK = function (system, messages, opts) {
    opts = opts || {};
    if (!connected()) return Promise.reject(new Error("Connect a model first — the button is in the toolbar."));
    const turns = messages.map(message => ({role: message.role, text: message.content}));
    return ask(system, turns, opts.signal).then(text => {
      if (opts.onText) opts.onText(text);
      const anchorId = opts.exercise ? anchorForExercise(opts.exercise) : null;
      if (anchorId) {
        appendTurns(anchorId, [
          {role: "user", text: "Submitted for marking:\n\n" +
            turns.map(turn => turn.text).join("\n\n").replace(/^MY ATTEMPT:\s*/, "")},
          {role: "assistant", text}
        ]);
      }
      return {text};
    });
  };

  window.GroundUpTutor = {
    mount(path) {
      lessonPath = path || "";
      load();
      buildRail();
      buildDialog();
      buildSettings(document.querySelector(".toolbar"));
      install();
      syncLabels();
    }
  };
})();
