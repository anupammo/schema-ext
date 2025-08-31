chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scanPage") {
    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      func: () => {
        return window.__SCHEMA_CRAFT_DATA__ || {};
      }
    }, (results) => {
      sendResponse(results[0]?.result || {});
    });
    return true; // Keep message channel open
  }
});
