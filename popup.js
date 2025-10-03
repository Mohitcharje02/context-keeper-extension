// Get current tab info and stats
async function getCurrentStats() {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  const statsDiv = document.getElementById('currentStats');
  statsDiv.textContent = `📊 ${tabs.length} tabs in current window`;
}

// Save current context
document.getElementById('saveContext').addEventListener('click', async () => {
  const nameInput = document.getElementById('contextName');
  const contextName = nameInput.value.trim() || `Context ${new Date().toLocaleString()}`;
  
  // Get all tabs in current window
  const tabs = await chrome.tabs.query({ currentWindow: true });
  
  // Get detailed info for each tab
  const tabsData = [];
  for (const tab of tabs) {
    try {
      // Try to get scroll position and form data from content script
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'getPageState' });
      tabsData.push({
        url: tab.url,
        title: tab.title,
        scrollPosition: response?.scrollPosition || 0,
        formData: response?.formData || {},
        videoTime: response?.videoTime || 0
      });
    } catch (e) {
      // If content script can't run (e.g., chrome:// pages), just save basic info
      tabsData.push({
        url: tab.url,
        title: tab.title,
        scrollPosition: 0,
        formData: {},
        videoTime: 0
      });
    }
  }
  
  // Save to storage
  const contextId = Date.now().toString();
  const context = {
    id: contextId,
    name: contextName,
    timestamp: new Date().toISOString(),
    tabs: tabsData
  };
  
  chrome.storage.local.get(['contexts'], (result) => {
    const contexts = result.contexts || [];
    contexts.unshift(context);
    // Keep only last 20 contexts
    if (contexts.length > 20) contexts.pop();
    
    chrome.storage.local.set({ contexts }, () => {
      nameInput.value = '';
      loadContexts();
      showNotification('Context saved!');
    });
  });
});

// Load and display saved contexts
function loadContexts() {
  chrome.storage.local.get(['contexts'], (result) => {
    const contexts = result.contexts || [];
    const listDiv = document.getElementById('contextList');
    
    if (contexts.length === 0) {
      listDiv.innerHTML = '<div class="empty-state">No saved contexts yet.<br>Save your first context above!</div>';
      return;
    }
    
    listDiv.innerHTML = contexts.map(ctx => `
      <div class="context-item">
        <div class="context-info">
          <div class="context-name">${escapeHtml(ctx.name)}</div>
          <div class="context-meta">${ctx.tabs.length} tabs • ${formatDate(ctx.timestamp)}</div>
        </div>
        <div class="context-actions">
          <button class="restore-btn" data-id="${ctx.id}">Restore</button>
          <button class="delete-btn" data-id="${ctx.id}">×</button>
        </div>
      </div>
    `).join('');
    
    // Add event listeners
    document.querySelectorAll('.restore-btn').forEach(btn => {
      btn.addEventListener('click', () => restoreContext(btn.dataset.id));
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => deleteContext(btn.dataset.id));
    });
  });
}

// Restore a saved context
async function restoreContext(contextId) {
  chrome.storage.local.get(['contexts'], async (result) => {
    const contexts = result.contexts || [];
    const context = contexts.find(c => c.id === contextId);
    
    if (!context) return;
    
    // Open all tabs
    for (const tabData of context.tabs) {
      const tab = await chrome.tabs.create({ url: tabData.url, active: false });
      
      // Wait a bit for page to load, then restore state
      setTimeout(async () => {
        try {
          await chrome.tabs.sendMessage(tab.id, {
            action: 'restorePageState',
            scrollPosition: tabData.scrollPosition,
            formData: tabData.formData,
            videoTime: tabData.videoTime
          });
        } catch (e) {
          console.log('Could not restore state for tab:', tab.id);
        }
      }, 2000);
    }
    
    showNotification(`Restored ${context.tabs.length} tabs!`);
    window.close();
  });
}

// Delete a context
function deleteContext(contextId) {
  chrome.storage.local.get(['contexts'], (result) => {
    const contexts = result.contexts || [];
    const filtered = contexts.filter(c => c.id !== contextId);
    chrome.storage.local.set({ contexts: filtered }, loadContexts);
  });
}

// Helper functions
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function showNotification(message) {
  const btn = document.getElementById('saveContext');
  const originalText = btn.textContent;
  btn.textContent = message;
  btn.style.background = '#8b5cf6';
  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = '#10b981';
  }, 1500);
}

// Initialize
getCurrentStats();
loadContexts();
