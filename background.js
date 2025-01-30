chrome.action.onClicked.addListener(() => {
    chrome.system.display.getInfo((displays) => {
        // Get the primary display screen dimensions
        const primaryDisplay = displays.find(display => display.isPrimary);
        const screenWidth = primaryDisplay.workArea.width;
        const screenHeight = primaryDisplay.workArea.height;

        // Set popup window dimensions
        const popupWidth = 500;
        const popupHeight = 600;

        // Calculate center position
        const left = Math.round((screenWidth - popupWidth) / 2);
        const top = Math.round((screenHeight - popupHeight) / 2);

        // Create popup window in the center
        chrome.windows.create({
            url: chrome.runtime.getURL("index.html"),
            type: "popup",
            width: popupWidth,
            height: popupHeight,
            left: left,
            top: top
        });
    });
});
