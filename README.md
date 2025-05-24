# SwipeToDeleteList

A performant React Native demo app featuring a swipe-to-delete list with undo functionality.  
This project uses [FlashList](https://shopify.github.io/flash-list/) for efficient rendering of large lists and provides a modern, smooth user experience.

---

## Video Demonstration

https://youtu.be/hWGQEc7FRxc

## Features

- **Swipe to Delete:** Swipe any item to the left to delete it.
- **Undo Delete:** Instantly undo accidental deletions with a snackbar-style undo button.
- **Add Items:** Easily add new items to the list with a floating action button on top right in the header.
- **High Performance:** Handles large lists smoothly using FlashList.

---

## Why FlashList?

[FlashList](https://shopify.github.io/flash-list/) (by Shopify) is used instead of React Native's built-in FlatList because:

- **Better Performance:** FlashList is optimized for large datasets and complex item layouts, reducing dropped frames and memory usage.
- **Accurate Item Measurement:** It provides more accurate item size estimation, leading to smoother scrolling.
- **Drop-in Replacement:** The API is very similar to FlatList, making migration easy.
- **Actively Maintained:** FlashList is actively maintained and used in production by major apps.

---

## Installation & Setup

1. **Clone the repository:**

   ```sh
   git clone https://github.com/yourusername/SwipeToDeleteList.git
   cd SwipeToDeleteList
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Start the app:**
   ```sh
   npx expo start
   ```

---

## Folder Structure

```
/screens
  SwipeListScreen.jsx
  PreviewScreen.jsx
/constants
  colors.js
/App.js
```

---

## Customization

- **Change List Size:** Edit `initialItems` in `SwipeListScreen.jsx`.
- **Change Colors:** Update values in `/constants/colors.js`.
- **Change Swipe Action:** Modify `showLeftSwipedOptions` in `SwipeListScreen.jsx`.

---
