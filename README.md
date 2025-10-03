📑 Context Keeper - Chrome Extension
Context Keeper is a powerful Chrome extension designed to save and restore your entire browsing context with a single click. It goes beyond simple tab management by saving the scroll position, form data, and even video timestamps, so you can pick up exactly where you left off after an interruption.

🚀 What it Does
Ever been deep into research with 20 tabs open, only to accidentally close the window? Or maybe you were filling out a long form and had to restart your computer? Context Keeper solves these problems by allowing you to save a snapshot of your current browsing session—not just the URLs, but the state of each page.

✨ Key Features
Full Context Saving: Saves open tabs along with their scroll position, form inputs, and video playback time.

One-Click Restore: Re-opens all saved tabs and restores their saved state automatically.

Selective Restore: Choose to restore all tabs from a saved session or select specific tabs to open.

Modern UI: A clean, beautiful, and intuitive "glass morphism" interface.

Session Naming: Give your saved contexts custom names (e.g., "Work Research," "Holiday Planning") for easy organization.

Lightweight & Fast: Built with pure JavaScript, ensuring minimal impact on your browser's performance.

🛠️ Installation (for local development)
To install and test the extension locally, follow these steps:

Download the Code: Clone or download this repository as a ZIP file and unzip it.

Open Chrome Extensions: Open Google Chrome and navigate to chrome://extensions.

Enable Developer Mode: In the top-right corner, turn on the "Developer mode" toggle.

Load the Extension:

Click the "Load unpacked" button that appears.

Select the entire Context Keeper folder that you unzipped.

The Context Keeper icon should now appear in your Chrome toolbar!

usage How to Use
Arrange Your Tabs: Open the tabs you want to save as part of a session. Scroll to a specific position, start a video, or type into a form.

Open the Extension: Click the "Context Keeper" icon in your toolbar.

Save the Context:

Optionally, give your context a descriptive name.

Click the "💾 Save Current Context" button.

Restore a Context:

Click the extension icon again.

Find your saved session in the list.

Click "Restore All" to open all tabs from that session, or click "Details" to select specific tabs before restoring.

📁 Project File Structure
The project is organized into the following files:

manifest.json: The core file that defines the extension's properties, permissions, and scripts.

popup.html: The HTML structure for the main popup interface.

popup.js: The JavaScript logic that handles saving, loading, and restoring contexts within the popup.

background.js: A service worker script that could be used for future background tasks.

content.js: A script injected into each webpage to read and restore page-specific data like scroll position and form inputs.

/icons: Contains the .png icons for the extension toolbar.

🔧 Built With
HTML5

CSS3 (for styling the popup)

JavaScript (ES6+)

Chrome Extension Manifest V3 APIs

💡 Future Ideas
Cloud Sync: Sync saved contexts across different devices using a Google account.

Auto-Save: Automatically save the context at regular intervals.

Search Functionality: Quickly find a saved context by name or by a tab's title/URL.

Export/Import: Share saved contexts with other users.

Feel free to contribute to the project by submitting issues or pull requests!
