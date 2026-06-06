// popup-module.js

// Parse module name from query string
const params = new URLSearchParams(location.search);
const moduleName = params.get("module");

const titleEl = document.getElementById("module-title");
const rootEl = document.getElementById("module-root");

// Back button → return to main popup
document.getElementById("back").onclick = () => {
  window.location.href = chrome.runtime.getURL("popup.html");
};

// Request module UI info from background
chrome.runtime.sendMessage(
  { kind: "popup.getModuleUI", module: moduleName },
  (res) => {
    if (!res || !res.page) {
      rootEl.innerHTML = `<p>No UI available for module: ${moduleName}</p>`;
      return;
    }

    titleEl.textContent = moduleName;

    // Load the module's full-page HTML
    fetch(chrome.runtime.getURL(res.page))
      .then((r) => r.text())
      .then((html) => {
        rootEl.innerHTML = html;

        // Load optional JS
        if (res.js) {
          import(chrome.runtime.getURL(res.js));
        }
      });
  }
);
