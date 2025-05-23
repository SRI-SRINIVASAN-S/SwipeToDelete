import { useState, useRef, useLayoutEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Button } from "react-native";
import { Pressable, Swipeable } from "react-native-gesture-handler";
import { FlashList } from "@shopify/flash-list";
import { MaterialIcons } from "@expo/vector-icons";
import { GlobalStyles } from "../constants/colors";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";

const initialItems = Array.from({ length: 3 }, (_, i) => ({
  id: `${i}`,
  text: `Item ${i + 1}`,
}));

const SwipeListScreen = () => {
  const [listItems, setListItems] = useState(initialItems);
  const [lastDeletedListItem, setLastDeletedListItem] = useState([]);
  const [showUndoOption, setShowUndoOption] = useState(false);
  const undoButtonTimer = useRef(null); // Timer for hiding the undo button
  const swappableRefs = useRef({}); // Store refs for each Swipeable item
  const [nextId, setNextId] = useState(initialItems.length);
  const navigation = useNavigation();

  /**
   * Add a new item to the list
   */
  function addListItems() {
    const newItem = {
      id: `${nextId}`,
      text: `Item ${nextId + 1}`,
    };
    setListItems([...listItems, newItem]);
    setNextId((prev) => prev + 1);
  }

  /**
   * Delete the swiped item and show undo option
   */
  function handleDeleteListItem(swipedDeleteItem) {
    // Close swipe if still open
    if (swappableRefs.current[swipedDeleteItem.id]) {
      swappableRefs.current[swipedDeleteItem.id].close();
    }

    // Remove the item from the list
    setListItems((prev) =>
      prev.filter((item) => item.id !== swipedDeleteItem.id)
    );

    // Save deleted item for potential undo
    setLastDeletedListItem((prev) => [swipedDeleteItem, ...prev]);
    setShowUndoOption(true);

    // Start a 4-second timer to hide undo option
    if (undoButtonTimer) clearTimeout(undoButtonTimer);
    undoButtonTimer.current = setTimeout(() => {
      setLastDeletedListItem([]);
      setShowUndoOption(false);
    }, 9000);
  }

  /**
   * Restore the last deleted item
   */
  function handleUndoLastDeleted() {
    if (lastDeletedListItem.length > 0) {
      const [lastDeleted, ...restDeleteItems] = lastDeletedListItem;
      setListItems((prev) => [lastDeleted, ...prev]);
      setLastDeletedListItem(restDeleteItems);
      if (restDeleteItems.length === 0) {
        setShowUndoOption(false);
      }
    }
    clearTimeout(undoButtonTimer.current);
  }

  /**
   * Render the red delete button shown when swiping left
   */
  function showLeftSwipedOptions(swipedItem) {
    return (
      <TouchableOpacity
        style={styles.deleteBox}
        onPress={() => handleDeleteListItem(swipedItem)}
      >
        <MaterialIcons name="delete-forever" size={32} color="white" />
      </TouchableOpacity>
    );
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          android_ripple={{ color: "white" }}
          style={({ pressed }) => pressed && styles.pressed}
          onPress={addListItems}
        >
          <Entypo
            style={{ marginRight: 15 }}
            name="add-to-list"
            color={"white"}
            size={24}
          />
        </Pressable>
      ),
    });
  }, [navigation, listItems]);

  function renderListItems({ item }) {
    return (
      <Swipeable
        ref={(ref) => {
          // Store ref to programmatically close it later
          if (ref) swappableRefs.current[item.id] = ref;
        }}
        renderLeftActions={() => showLeftSwipedOptions(item)}
        onSwipeableWillOpen={() => {
          // Close all other opened swipeables when a new one is swiped
          Object.entries(swappableRefs.current).forEach(([id, ref]) => {
            if (id !== item.id && ref) ref.close();
          });
        }}
      >
        <View style={styles.ListitemContainer}>
          <Text style={styles.ListItemText}>{item.text}</Text>
        </View>
      </Swipeable>
    );
  }

  return (
    <View style={styles.container}>
      {/* Scrollable list using FlashList for better performance */}
      <FlashList
        data={listItems}
        renderItem={renderListItems}
        estimatedItemSize={60}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator}></View>}
      />

      {/* Undo banner shown at the bottom after delete */}
      {showUndoOption && lastDeletedListItem && (
        <TouchableOpacity
          style={styles.undoBox}
          onPress={handleUndoLastDeleted}
        >
          <Text style={styles.undoText}>
            Undo {lastDeletedListItem[0].text}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SwipeListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  ListitemContainer: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    justifyContent: "center",
  },
  ListItemText: {
    fontSize: 18,
  },
  separator: {
    height: 2,
    backgroundColor: "#eee",
  },
  deleteBox: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    flex: 1,
  },
  undoBox: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    backgroundColor: GlobalStyles.colors.primary500,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  undoText: {
    color: "white",
    fontSize: 16,
  },
  pressed: {
    opacity: 0.75,
  },
});
