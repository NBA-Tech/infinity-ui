import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Modal } from "react-native";
import { PanGestureHandler, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const DraggableResizableElement = ({ element }) => {
  const [infoVisible, setInfoVisible] = useState(false);

  // Position and size in px
  const translateX = useSharedValue(element.x * screenWidth);
  const translateY = useSharedValue(element.y * screenHeight);
  const width = useSharedValue(element.width * screenWidth);
  const height = useSharedValue(element.height * screenHeight);

  // Dragging
  const dragHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: () => {
      translateX.value = withSpring(Math.min(Math.max(translateX.value, 0), screenWidth - width.value));
      translateY.value = withSpring(Math.min(Math.max(translateY.value, 0), screenHeight - height.value));
    },
  });

  // Resize (bottom-right corner)
  const resizeHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startWidth = width.value;
      ctx.startHeight = height.value;
    },
    onActive: (event, ctx) => {
      width.value = Math.max(50, ctx.startWidth + event.translationX);
      height.value = Math.max(30, ctx.startHeight + event.translationY);
    },
    onEnd: () => {
      width.value = withSpring(Math.min(width.value, screenWidth - translateX.value));
      height.value = withSpring(Math.min(height.value, screenHeight - translateY.value));
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    width: width.value,
    height: height.value,
  }));

  const cornerStyle = useAnimatedStyle(() => ({
    left: width.value - 20,
    top: height.value - 20,
  }));

  return (
    <>
      <PanGestureHandler onGestureEvent={dragHandler}>
        <Animated.View style={[styles.element, animatedStyle]}>
          <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center" }} onPress={() => setInfoVisible(true)}>
            <Text style={styles.elementText}>{element.label}</Text>
          </TouchableOpacity>

          {/* Resize corner */}
          <PanGestureHandler onGestureEvent={resizeHandler}>
            <Animated.View style={[styles.corner, cornerStyle]} />
          </PanGestureHandler>
        </Animated.View>
      </PanGestureHandler>

      <Modal visible={infoVisible} transparent animationType="fade" onRequestClose={() => setInfoVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{element.label} Info</Text>
            <Text>Width: {(width.value / screenWidth * 100).toFixed(1)}%</Text>
            <Text>Height: {(height.value / screenHeight * 100).toFixed(1)}%</Text>
            <Text>Color: {element.color}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setInfoVisible(false)}>
              <Text style={{ color: "#fff" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const InvoiceGenerator = () => {
  const elements = [
    { id: "1", label: "Billing Address", x: 0.05, y: 0.7, width: 0.4, height: 0.08, color: "#fbbf24" },
    { id: "2", label: "Name", x: 0.55, y: 0.7, width: 0.3, height: 0.08, color: "#60a5fa" },
    { id: "3", label: "ID", x: 0.05, y: 0.8, width: 0.2, height: 0.06, color: "#34d399" },
    { id: "4", label: "Invoice Details", x: 0.3, y: 0.8, width: 0.6, height: 0.12, color: "#f87171" },
    { id: "5", label: "Signature", x: 0.05, y: 0.92, width: 0.4, height: 0.08, color: "#a78bfa" },
  ];

  return (
    <GestureHandlerRootView style={styles.container}>
      {elements.map((el) => (
        <DraggableResizableElement key={el.id} element={el} />
      ))}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  element: {
    position: "absolute",
    backgroundColor: "#ddd",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  elementText: { fontSize: 14, color: "#111", fontWeight: "bold" },
  corner: {
    position: "absolute",
    width: 20,
    height: 20,
    backgroundColor: "#6366f1",
    borderRadius: 4,
  },
  modalBackground: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center", alignItems: "center" },
  modalContainer: { width: 280, padding: 20, backgroundColor: "#fff", borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  closeButton: { backgroundColor: "#6366f1", paddingVertical: 10, borderRadius: 6, alignItems: "center", marginTop: 10 },
});

export default InvoiceGenerator;
