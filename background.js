// background.js — Substrate Supervisor (MV3-safe, lazy init)

let substrateTabId = null;
let heartbeatStarted = false;
let lastHeartbeat = Date.now();

const HEARTBEAT_INTERVAL = 3000; // 3 seconds
const HEARTBEAT_TIMEOUT = 8000;  // 8 seconds

// Create substrate.html tab only when needed
async function ensureSubstrateTab() {
  if (substrateTabId !== null) return;

  const tab = await chrome.tabs.create({
    url: chrome.runtime.getURL("substrate.html"),
    active: false
  });

  substrateTabId = tab.id;
  console.log("[background] substrate tab created:", substrateTabId);
}

// Ask substrate-runtime to init (idempotent)
async function ensureSubstrateRuntime() {
  chrome.runtime.sendMessage({ kind: "substrate.init" }, () => {});
}

// Heartbeat loop: ask substrate to tick
async function heartbeatLoop() {
  if (!heartbeatStarted) return; // safety

  await ensureSubstrateTab();

  try {
    await ensureSubstrateRuntime();

    chrome.runtime.sendMessage({ kind: "substrate.tick" }, (res) => {
      if (res && res.ok) {
        lastHeartbeat = Date.now();
        if (Array.isArray(res.actions)) {
          handleActions(res.actions);
        }
      }
    });
  } catch (err) {
    console.error("[WCO] Substrate tick failed:", err);
  }

  if (Date.now() - lastHeartbeat > HEARTBEAT_TIMEOUT) {
    console.warn("[WCO] Substrate unresponsive — requesting shutdown...");
    chrome.runtime.sendMessage({ kind: "substrate.shutdown" }, () => {});
    lastHeartbeat = Date.now();
  }

  setTimeout(heartbeatLoop, HEARTBEAT_INTERVAL);
}

// Start heartbeat once, on demand
function startHeartbeat() {
  if (heartbeatStarted) return;
  heartbeatStarted = true;
  heartbeatLoop();
}

// User clicks extension icon → boot substrate lazily
chrome.action.onClicked.addListener(async () => {
  await ensureSubstrateTab();
  startHeartbeat();

  // Optional: bring substrate tab to front on first click
  if (substrateTabId !== null) {
    chrome.tabs.update(substrateTabId, { active: true });
  }
});

// Browser → Substrate: forward DOM events
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.kind === "browser.event") {
    chrome.runtime.sendMessage(
      { kind: "substrate.browserEvent", event: msg.event },
      () => {}
    );
    sendResponse({ ok: true });
    return true;
  }

  if (!msg || !msg.kind) return;

  switch (msg.kind) {
    case "popup.listModules":
      chrome.runtime.sendMessage({ kind: "substrate.init" }, () => {
        // substrate-runtime can expose listModules via another message if needed
        // or you can store module list in storage and read it here
        sendResponse({ modules: [] });
      });
      return true;

    case "popup.reboot":
      chrome.runtime.sendMessage({ kind: "substrate.shutdown" }, () => {
        chrome.runtime.sendMessage({ kind: "substrate.init" }, () => {
          sendResponse({ ok: true });
        });
      });
      return true;

    default:
      console.warn("[WCO] Unknown popup message:", msg);
  }
});

// Substrate → Browser: execute actions
function handleActions(actions) {
  for (const act of actions) {
    switch (act.type) {
      case "overlay.highlight":
        chrome.tabs.sendMessage(act.tabId, {
          kind: "overlay.highlight",
          x: act.x,
          y: act.y
        });
        break;

      case "log":
        console.log("[WCO Action]", act.message);
        break;

      default:
        console.warn("[WCO] Unknown action:", act);
    }
  }
}
