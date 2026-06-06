// popup.js

// DOM references
const moduleList = document.getElementById("module-list");
const moduleFragments = document.getElementById("module-fragments");
const modulePages = document.getElementById("module-pages");

// Core UI buttons
document.getElementById("open-substrate").onclick = () => {
  chrome.tabs.create({ url: chrome.runtime.getURL("substrate.html") });
};

document.getElementById("open-advanced").onclick = () => {
  chrome.tabs.create({ url: chrome.runtime.getURL("substrate-advanced.html") });
};

document.getElementById("reload-modules").onclick = () => {
  chrome.runtime.sendMessage({ kind: "popup.reboot" }, () => {
    window.close();
  });
};

// Request module list from background
chrome.runtime.sendMessage({ kind: "popup.listModules" }, (res) => {
  const modules = res?.modules || [];
  renderModuleList(modules);
  loadModuleFragments(modules);
  loadModulePages(modules);
});

// Render module names
function renderModuleList(modules) {
  moduleList.innerHTML = "";
  modules.forEach((m) => {
    const li = document.createElement("li");
    li.textContent = m.name;
    moduleList.appendChild(li);
  });
}

// Load small UI fragments
function loadModuleFragments(modules) {
  modules.forEach((m) => {
    if (!m.ui?.popupFragment) return;

    const url = chrome.runtime.getURL(m.ui.popupFragment);

    fetch(url)
      .then((r) => r.text())
      .then((html) => {
        const div = document.createElement("div");
        div.className = "module-fragment";
        div.innerHTML = html;
        moduleFragments.appendChild(div);

        if (m.ui.popupFragmentJS) {
          import(chrome.runtime.getURL(m.ui.popupFragmentJS));
        }
      });
  });
}

// Add links to full module pages
function loadModulePages(modules) {
  modules.forEach((m) => {
    if (!m.ui?.popupPage) return;

    const btn = document.createElement("div");
    btn.className = "module-link";
    btn.textContent = `Open ${m.name}`;
    btn.onclick = () => {
      chrome.tabs.create({
        url: chrome.runtime.getURL(
          `popup-module.html?module=${encodeURIComponent(m.name)}`
        ),
      });
    };

    modulePages.appendChild(btn);
  });
}
