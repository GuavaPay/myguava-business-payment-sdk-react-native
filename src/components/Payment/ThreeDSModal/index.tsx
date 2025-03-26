import { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { ThreeDSView } from "../ThreeDS";

import { useGuavapayPaymentsContext } from "@/components/Payment/context";
import { use3DS } from "@/hooks/use3DS";
export const ThreeDSModal = () => {
  const { strings, theme } = useGuavapayPaymentsContext();

  const [isOpen, setIsOpen] = useState(false);
  const { cancel } = use3DS({
    onStart: () => setIsOpen(true),
    onFinish: () => setIsOpen(false),
  });

  const onCancel = () => {
    cancel();
    setIsOpen(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      statusBarTranslucent
      visible={isOpen}
      onRequestClose={onCancel}
    >
      <SafeAreaProvider>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: theme.modal.header.backgroundColor,
          }}
        >
          <View style={theme.modal.header}>
            <Text style={theme.modal.title}>{strings.threeDS.title}</Text>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={theme.modal.cancel}>
                {strings.threeDS.cancelText}
              </Text>
            </TouchableOpacity>
          </View>
          <ThreeDSView />
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
};

const styles = StyleSheet.create({
  cancelButton: {
    position: "absolute",
    right: 10,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
