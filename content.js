// Content script that captures and restores page state

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPageState') {
    // Get current page state
    const state = {
      scrollPosition: window.scrollY,
      formData: getFormData(),
      videoTime: getVideoTime()
    };
    sendResponse(state);
  } else if (request.action === 'restorePageState') {
    // Restore page state
    restorePageState(request);
    sendResponse({ success: true });
  }
  return true; // Keep message channel open for async response
});

// Capture form data
function getFormData() {
  const formData = {};
  const inputs = document.querySelectorAll('input, textarea, select');
  
  inputs.forEach((input, index) => {
    if (input.type === 'password') return; // Skip passwords for security
    
    const key = input.name || input.id || `input_${index}`;
    
    if (input.type === 'checkbox' || input.type === 'radio') {
      formData[key] = input.checked;
    } else if (input.type !== 'file') {
      formData[key] = input.value;
    }
  });
  
  return formData;
}

// Get video playback time (YouTube, HTML5 video)
function getVideoTime() {
  // Try YouTube first
  const ytVideo = document.querySelector('video.html5-main-video');
  if (ytVideo) return ytVideo.currentTime;
  
  // Try any HTML5 video
  const video = document.querySelector('video');
  if (video) return video.currentTime;
  
  return 0;
}

// Restore page state
function restorePageState(state) {
  // Restore scroll position
  if (state.scrollPosition) {
    window.scrollTo(0, state.scrollPosition);
  }
  
  // Restore form data
  if (state.formData) {
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach((input, index) => {
      const key = input.name || input.id || `input_${index}`;
      if (state.formData.hasOwnProperty(key)) {
        if (input.type === 'checkbox' || input.type === 'radio') {
          input.checked = state.formData[key];
        } else if (input.type !== 'password' && input.type !== 'file') {
          input.value = state.formData[key];
        }
      }
    });
  }
  
  // Restore video time
  if (state.videoTime && state.videoTime > 0) {
    setTimeout(() => {
      const ytVideo = document.querySelector('video.html5-main-video');
      if (ytVideo) {
        ytVideo.currentTime = state.videoTime;
        return;
      }
      
      const video = document.querySelector('video');
      if (video) {
        video.currentTime = state.videoTime;
      }
    }, 1000); // Wait for video to load
  }
}
