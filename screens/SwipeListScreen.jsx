import { useState, useRef, useLayoutEffect, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { FlashList } from "@shopify/flash-list";
import { MaterialIcons } from "@expo/vector-icons";
import { GlobalStyles } from "../constants/colors";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";

const initialItems = Array.from({ length: 30 }, (_, i) => ({
  id: `${i}`,
  text: `Item ${i + 1}`,
}));

const SwipeListScreen = () => {
  const [listItems, setListItems] = useState(initialItems);
  const [lastDeletedListItem, setLastDeletedListItem] = useState(null);
  const [showUndoOption, setShowUndoOption] = useState(false);
  const [nextId, setNextId] = useState(initialItems.length);
  const undoButtonTimer = useRef(null); // Timer for hiding the undo button
  const swappableRefs = useRef({}); // Store refs for each Swipeable item
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
    setLastDeletedListItem(swipedDeleteItem);
    setShowUndoOption(true);

    // Start a 4-second timer to hide undo option
    if (undoButtonTimer.current) clearTimeout(undoButtonTimer.current);
    undoButtonTimer.current = setTimeout(() => {
      setLastDeletedListItem(null);
      setShowUndoOption(false);
    }, 7000);
  }

  /**
   * Restore the last deleted item
   */
  function handleUndoLastDeleted() {
    if (lastDeletedListItem) {
      setListItems((prev) => [lastDeletedListItem, ...prev]);
      setShowUndoOption(false);
      setLastDeletedListItem(null);
      clearTimeout(undoButtonTimer.current);
    }
  }

  /**
   * Render the red delete button shown when swiping left
   */
  function showLeftSwipedOptions() {
    return (
      <TouchableOpacity style={styles.deleteBox}>
        <MaterialIcons name="delete-sweep" size={32} color="white" />
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

  useEffect(() => {
    return () => {
      if (undoButtonTimer.current) {
        clearTimeout(undoButtonTimer.current);
      }
    };
  }, []);

  function renderListItems({ item }) {
    return (
      <Swipeable
        ref={(ref) => {
          // Store ref to programmatically close it later
          if (ref) swappableRefs.current[item.id] = ref;
        }}
        renderLeftActions={showLeftSwipedOptions}
        onSwipeableWillOpen={(direction) => {
          if (direction === "left") {
            handleDeleteListItem(item);
          }
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
          <Text style={styles.undoText}>Undo {lastDeletedListItem.text}</Text>
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
    height: 1,
    backgroundColor: GlobalStyles.colors.gray500,
  },
  deleteBox: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "flex-start",
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
