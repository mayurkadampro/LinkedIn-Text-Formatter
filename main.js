const samplePost = `🚀 𝐓𝐢𝐫𝐞𝐝 𝐨𝐟 𝐩𝐥𝐚𝐢𝐧 𝐋𝐢𝐧𝐤𝐞𝐝𝐈𝐧 𝐩𝐨𝐬𝐭𝐬? 𝐒𝐭𝐚𝐧𝐝 𝐨𝐮𝐭 𝐰𝐢𝐭𝐡 𝐛𝐨𝐥𝐝, 𝐢𝐭𝐚𝐥𝐢𝐜, 𝐚𝐧𝐝 𝐦𝐨𝐫𝐞!

If you’ve ever wished for 𝐛𝐨𝐥𝐝, 𝑖𝑡𝑎𝑙𝑖𝑐, or u̲n̲d̲e̲r̲l̲i̲n̲e̲ in your LinkedIn posts, I’ve got great news!

𝐋𝐢𝐧𝐤𝐞𝐝𝐈𝐧 𝐓𝐞𝐱𝐭 𝐅𝐨𝐫𝐦𝐚𝐭𝐭𝐞𝐫, a Chrome extension that helps you:
✅ Format your LinkedIn posts in seconds
✅ Add emphasis with styled text & emojis 😃
✅ Improve engagement effortlessly

Would love your feedback! How do you currently format your LinkedIn posts? Let me know in the comments. 💬
`;

window.addEventListener("load", () => {
  const editor = document.getElementById("editor");
  const emojiPicker = document.getElementById("emoji-picker");
  const previewContent = document.getElementById("preview-content");


  // Function to save text to localStorage
  function saveToLocalStorage() {
    const content = { value: editor.value };
    localStorage.setItem("editorContent", JSON.stringify(content));
  }

  function updatePreview() {
    // Mount the React preview component
    if (previewContent) {
      previewContent.textContent = editor.value || samplePost;
    }
    saveToLocalStorage();
  }

  // Function to load saved text from localStorage
  function loadFromLocalStorage() {
    const savedText = localStorage.getItem("editorContent");
    if (savedText) {
      editor.value = JSON.parse(savedText).value;
      previewContent.textContent = editor.value;
    } else {
      previewContent.textContent = samplePost;
    }
  }

  function toNormalText(text) {
    return text
      .replace(/[\uD835][\uDC00-\uDC9B]/g, (match) => {
        const codePoint = match.charCodeAt(1) - 0xdc00 + 0x1d400;

        if (codePoint >= 0x1d400 && codePoint <= 0x1d419) {
          // Bold uppercase
          return String.fromCharCode("A".charCodeAt(0) + (codePoint - 0x1d400));
        } else if (codePoint >= 0x1d41a && codePoint <= 0x1d433) {
          // Bold lowercase
          return String.fromCharCode("a".charCodeAt(0) + (codePoint - 0x1d41a));
        } else if (codePoint >= 0x1d434 && codePoint <= 0x1d44d) {
          // Italic uppercase
          return String.fromCharCode("A".charCodeAt(0) + (codePoint - 0x1d434));
        } else if (codePoint >= 0x1d44e && codePoint <= 0x1d467) {
          // Italic lowercase
          return String.fromCharCode("a".charCodeAt(0) + (codePoint - 0x1d44e));
        } else if (codePoint >= 0x1d468 && codePoint <= 0x1d481) {
          // Bold Italic uppercase
          return String.fromCharCode("A".charCodeAt(0) + (codePoint - 0x1d468));
        } else if (codePoint >= 0x1d482 && codePoint <= 0x1d49b) {
          // Bold Italic lowercase
          return String.fromCharCode("a".charCodeAt(0) + (codePoint - 0x1d482));
        }
        return match;
      })
      .replace(/[\u0332\u0336]/g, ""); // Remove underline and strikethrough
  }

  function checkMatchingStyle(text, type) {
    const firstChar = Array.from(text)[0];
    const code = firstChar?.codePointAt(0);

    switch (type) {
      case "bold":
        return code >= 0x1d400 && code <= 0x1d433;
      case "italic":
        return code >= 0x1d434 && code <= 0x1d467;
      case "boldItalic":
        return code >= 0x1d468 && code <= 0x1d49b;
      case "underline":
        return text.includes("\u0332");
      case "strikethrough":
        return text.includes("\u0336");
      default:
        return false;
    }
  }

  function formatText(type) {
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const selectedText = editor.value.substring(start, end);

    if (!selectedText) return;

    // Save current scroll position
    const scrollPosition = editor.scrollTop;

    // Check if current style matches clicked button style
    const isMatchingStyle = checkMatchingStyle(selectedText, type);

    const normalText = toNormalText(selectedText);
    const isFormatted = normalText !== selectedText;

    const resultText =
      isFormatted && isMatchingStyle
        ? normalText
        : applyFormatting(normalText, type);

    editor.value =
      editor.value.substring(0, start) +
      resultText +
      editor.value.substring(end);
    editor.focus();
    editor.selectionStart = start;
    editor.selectionEnd = start + resultText.length;

    // Restore scroll position
    editor.scrollTop = scrollPosition;

    updatePreview();
  }

  function applyFormatting(text, type) {
    switch (type) {
      case "bold":
        return text.replace(/[A-Za-z0-9]/g, (char) => {
          if (/[A-Za-z]/.test(char)) {
            const baseCode = char >= "A" && char <= "Z" ? 0x1d400 : 0x1d41a;
            const offset = char.toUpperCase().charCodeAt(0) - 65;
            return String.fromCodePoint(baseCode + offset);
          } else {
            return String.fromCodePoint(0x1d7ce + (char.charCodeAt(0) - 48)); // Bold numbers
          }
        });

      case "italic":
        return text.replace(/[A-Za-z0-9]/g, (char) => {
          if (/[A-Za-z]/.test(char)) {
            const baseCode = char >= "A" && char <= "Z" ? 0x1d434 : 0x1d44e;
            const offset = char.toUpperCase().charCodeAt(0) - 65;
            return String.fromCodePoint(baseCode + offset);
          } else {
            return char; // Italic digits don't exist in Unicode
          }
        });

      case "boldItalic":
        return text.replace(/[A-Za-z0-9]/g, (char) => {
          if (/[A-Za-z]/.test(char)) {
            const baseCode = char >= "A" && char <= "Z" ? 0x1d468 : 0x1d482;
            const offset = char.toUpperCase().charCodeAt(0) - 65;
            return String.fromCodePoint(baseCode + offset);
          } else {
            return char; // Bold Italic digits don't exist in Unicode
          }
        });

      case "underline":
        return text
          .split("")
          .map((char) => char + "\u0332") // Add underline modifier
          .join("");

      case "strikethrough":
        return text
          .split("")
          .map((char) => char + "\u0336") // Add strikethrough modifier
          .join("");

      default:
        return text;
    }
  }

  // Emoji functions
  const emojis = [
    "😀",
    "😃",
    "😄",
    "😁",
    "😅",
    "😂",
    "🤣",
    "😊",
    "😇",
    "🙂",
    "🙃",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😘",
    "😗",
    "😙",
    "😚",
    "😋",
    "😛",
    "😝",
    "😜",
    "🤪",
    "🤨",
    "🧐",
    "🤓",
    "😎",
    "🤔",
    "🤗",
    "🥺",
    "😢",
    "😭",
    "🤩",
    "🥳",
    "😡",
    "😠",
    "🤬",
    "😷",
    "🤒",
    "🤕",
    "🤧",
    "🥶",
    "😳",
    "👍",
    "👎",
    "👏",
    "🙌",
    "🤝",
    "👊",
    "✊",
    "🤛",
    "🤜",
    "🤞",
    "✌️",
    "🤟",
    "🤘",
    "👌",
    "🙏",
    "🖖",
    "🤲",
    "✋",
    "🤚",
    "👋",
    "🖐",
    "❤️",
    "🧡",
    "💛",
    "💚",
    "💙",
    "💜",
    "🖤",
    "💔",
    "❣️",
    "💕",
    "💞",
    "💓",
    "💗",
    "💖",
    "🐶",
    "🐱",
    "🐭",
    "🐹",
    "🐰",
    "🦊",
    "🐻",
    "🐼",
    "🐨",
    "🐯",
    "🦁",
    "🦄",
    "🐸",
    "🦋",
    "🌸",
    "🌺",
    "🌻",
    "🌼",
    "🌵",
    "🍁",
    "🍄",
    "🍎",
    "🍊",
    "🍇",
    "🍉",
    "🍌",
    "🍍",
    "🥭",
    "🍓",
    "🥥",
    "🍔",
    "🍟",
    "🌭",
    "🍿",
    "🍩",
    "🍪",
    "🧁",
    "🎂",
    "🍫",
    "🍯",
    "🥗",
    "🥩",
    "💡",
    "🔑",
    "⚽",
    "🏀",
    "🏈",
    "⚾",
    "🎾",
    "🏐",
    "🏓",
    "🏸",
    "🎱",
    "🪁",
    "🛹",
    "⛳",
    "🥋",
    "🏋️‍♀️",
    "💻",
    "🖥",
    "📱",
    "📞",
    "⌚",
    "🪑",
    "🖍",
    "✏️",
    "📂",
    "🗂",
    "📜",
    "📰",
    "📇",
    "🎁",
    "♻️",
    "☮️",
    "☯️",
    "⚛️",
    "💢",
    "💬",
    "💭",
    "🃏",
    "🀄",
    "💹",
    "🆙",
    "🔝",
    "❓",
    "❗",
    "🌌",
    "🌅",
    "🌄",
    "🌃",
    "🌇",
    "🛣",
    "🏙",
    "🏞",
    "🗻",
    "🌋",
    "🏔",
    "🗾",
    "🏖",
    "🏝",
    "🛤",
    "🛕",
    "🕌",
    "🕍",
    "🌟",
  ];

  function initEmojiPicker() {
    setTimeout(() => {
      emojiPicker.innerHTML = emojis
        .map(
          (emoji) =>
            `<button class="emoji-btn" data-emoji="${emoji}">${emoji}</button>`
        )
        .join("");
    }, 1000);
  }

  function toggleEmojiPicker() {
    emojiPicker.style.display =
      emojiPicker.style.display === "grid" ? "none" : "grid";
  }

  function insertEmoji(event) {
    if (event.target.matches(".emoji-btn")) {
      const emoji = event.target.dataset.emoji;
      const start = editor.selectionStart;
      editor.value =
        editor.value.slice(0, start) + emoji + editor.value.slice(start);
      editor.selectionStart = editor.selectionEnd = start + emoji.length;

      toggleEmojiPicker();
      updatePreview();
    }
  }

  function clearEditor() {
    if (confirm("Are you sure you want to clear all content?")) {
      localStorage.clear();
      editor.value = ""; // Clear the text editor
      previewContent.textContent = samplePost;
    }
  }

  function insertBulletPoint() {
    const editor = document.getElementById("editor");
    const start = editor.selectionStart;
    const end = editor.selectionEnd;

    // Extract the text before, within, and after the selection
    const beforeText = editor.value.substring(0, start);
    const selectedText = editor.value.substring(start, end);
    const afterText = editor.value.substring(end);

    const bulletUnicode = "• ";
    let updatedText;

    if (selectedText.includes("\n")) {
      // If the selection spans multiple lines, add bullets to each line
      updatedText = selectedText
        .split("\n")
        .map((line) => (line.trim() ? bulletUnicode + line : line))
        .join("\n");
    } else {
      // If the selection is a single line, add a bullet point to it
      updatedText = bulletUnicode + selectedText;
    }

    // Update the editor content
    editor.value = beforeText + updatedText + afterText;

    // Restore the selection range
    editor.selectionStart = start;
    editor.selectionEnd = start + updatedText.length;
    updatePreview();
  }

  function insertOrderedList() {
    const start = editor.selectionStart;
    const end = editor.selectionEnd;

    // Find the start of the current line
    const beforeText = editor.value.substring(0, start);
    const lastNewline = beforeText.lastIndexOf("\n");
    const lineStart = lastNewline + 1;

    // Determine the list number based on lines before
    const linesBefore = beforeText.split("\n").length;
    const listNumberUnicode = String.fromCodePoint(0x2460 + (linesBefore - 1)); // Unicode starts at ① (0x2460)

    const orderedUnicode = `${listNumberUnicode} `;
    editor.value =
      editor.value.substring(0, lineStart) +
      orderedUnicode +
      editor.value.substring(lineStart);

    // Adjust cursor to account for added characters
    editor.selectionStart = editor.selectionEnd = end + orderedUnicode.length;
  }

  function copyText() {
    const copyButton = document.getElementById("btn-copy");
    const tempTextArea = document.createElement("textarea");
    tempTextArea.value = editor.value;
    document.body.appendChild(tempTextArea);

    // Select and copy the text
    tempTextArea.select();
    try {
      document.execCommand("copy");
      copyButton.textContent = "Copied!";
      setTimeout(() => {
        copyButton.textContent = "Copy text";
      }, 800); // Reset after 2 seconds
    } catch (err) {
      alert("Failed to copy text. Please select and copy manually.");
    }

    // Clean up
    document.body.removeChild(tempTextArea);
  }

  // Event delegation to handle buttons by ID
  document.addEventListener("click", (event) => {
    if (event.target.matches("#btn-bold")) {
      formatText("bold");
    } else if (event.target.matches("#btn-italic")) {
      formatText("italic");
    } else if (event.target.matches("#btn-bold-italic")) {
      formatText("boldItalic");
    } else if (event.target.matches("#btn-underline")) {
      formatText("underline");
    } else if (event.target.matches("#btn-strikethrough")) {
      formatText("strikethrough");
    } else if (event.target.matches("#btn-add-emoji")) {
      toggleEmojiPicker();
    } else if (event.target.matches("#btn-bullet-point")) {
      insertBulletPoint();
    } else if (event.target.matches("#btn-ordered-list")) {
      insertOrderedList();
    } else if (event.target.matches("#btn-clear")) {
      clearEditor();
    } else if (event.target.matches(".emoji-btn")) {
      insertEmoji(event);
    } else if (event.target.matches("#btn-copy")) {
      copyText();
    } else {
      // Close emoji picker when clicking outside
      if (
        !event.target.closest(".emoji-picker") &&
        !event.target.closest('[title="Add emoji"]')
      ) {
        if (emojiPicker) emojiPicker.style.display = "none";
      }
    }
  });

  // Initialize
  initEmojiPicker();

  // Load the saved content when the extension starts
  loadFromLocalStorage();

  // Listen for text changes and save to localStorage
  editor.addEventListener("input", updatePreview);
});
