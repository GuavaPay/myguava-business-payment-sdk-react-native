import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  ViewStyle,
  TextStyle,
  View,
} from "react-native";

import { useGuavapayPaymentsContext } from "@/components/Payment/context";
import { ApplePayIcon } from "@/components/icons";

export type ApplePayButtonStyle = "black" | "white" | "white-outline";
export type ApplePayButtonType =
  | "plain"
  | "buy"
  | "setup"
  | "donate"
  | "checkout"
  | "book"
  | "subscribe";

export interface ApplePayButtonProps {
  onPress: () => void;
  disabled?: boolean;
  buttonStyle?: ApplePayButtonStyle;
  buttonType?: ApplePayButtonType;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const ApplePayButton: React.FC<ApplePayButtonProps> = ({
  onPress,
  disabled = false,
  buttonStyle = "black",
  buttonType = "plain",
  style = {},
  textStyle = {},
}) => {
  const {
    strings: { platformPayText },
  } = useGuavapayPaymentsContext();
  // Only render on iOS
  if (Platform.OS !== "ios") {
    return null;
  }

  // Get button text based on type
  const getButtonText = () => {
    if (platformPayText) {
      return platformPayText;
    }

    switch (buttonType) {
      case "buy":
        return "Buy with";
      case "setup":
        return "Set up";
      case "donate":
        return "Donate with";
      case "checkout":
        return "Check out with";
      case "book":
        return "Book with";
      case "subscribe":
        return "Subscribe with";
      default:
        return "";
    }
  };

  // Get style based on buttonStyle
  const getContainerStyle = () => {
    switch (buttonStyle) {
      case "white":
        return styles.whiteButton;
      case "white-outline":
        return styles.whiteOutlineButton;
      case "black":
      default:
        return styles.blackButton;
    }
  };

  // Get text style based on buttonStyle
  const getTextColorStyle = () => {
    return buttonStyle === "black" ? styles.whiteText : styles.blackText;
  };

  return (
    <TouchableOpacity
      style={[styles.button, getContainerStyle(), style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      accessibilityLabel="Apple Pay button"
    >
      {getButtonText() && (
        <Text style={[styles.buttonText, getTextColorStyle(), textStyle]}>
          {getButtonText()}
        </Text>
      )}
      <View style={[styles.logo]}>
        <ApplePayIcon color={buttonStyle === "black" ? "#fff" : "#000"} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 16,
    minHeight: 44,
  },
  blackButton: {
    backgroundColor: "#000",
  },
  whiteButton: {
    backgroundColor: "#fff",
  },
  whiteOutlineButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    marginRight: 4,
  },
  logo: {
    height: 24,
    width: 48,
  },
  blackText: {
    color: "#000",
  },
  whiteText: {
    color: "#fff",
  },
});
