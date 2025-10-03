// Background service worker for Context Keeper

// Auto-save context on window close (optional feature)
chrome.windows.onRemoved.addListener((windowId) => {
  // Optional: Could implement auto-save here
  console.log('Window closed:', windowId);
});

// Listen for tab updates to detect when restoration is complete
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    console.log('Tab loaded:', tab.title);
  }
});

// Installation handler
chrome.runtime.onInstalled.addListener(() => {
  console.log('Context Keeper installed!');
  
  // Set default storage
  chrome.storage.local.get(['contexts'], (result) => {
    if (!result.contexts) {
      chrome.storage.local.set({ contexts: [] });
    }
  });
});
