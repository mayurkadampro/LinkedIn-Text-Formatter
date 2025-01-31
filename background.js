chrome.action.onClicked.addListener(() => {
    chrome.system.display.getInfo((displays) => {
        // Get the primary display screen dimensions
        const primaryDisplay = displays.find(display => display.isPrimary);
        const screenWidth = primaryDisplay.workArea.width;
        const screenHeight = primaryDisplay.workArea.height;

        // Set popup window dimensions with minimum and maximum constraints
        const popupWidth = Math.min(600, screenWidth * 0.8); // 80% of screen width up to 500px
        let popupHeight = 675; // Your optimal height

        // Adjust height if screen is too small
        if (screenHeight < 800) {
            popupHeight = Math.max(600, screenHeight * 0.85); // At least 500px but not more than 85% of screen height
        }

        // Calculate center position
        const left = Math.round((screenWidth - popupWidth) / 2);
        const top = Math.round((screenHeight - popupHeight) / 2);

        // Create popup window in the center with specific options
        chrome.windows.create({
            url: chrome.runtime.getURL("index.html"),
            type: "popup",
            width: Math.round(popupWidth),
            height: Math.round(popupHeight),
            left: left,
            top: top,
            focused: true,
            state: "normal"
        });
    });
});