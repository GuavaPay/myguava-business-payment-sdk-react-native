import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  Image,
  ViewStyle,
  TextStyle,
  View,
} from "react-native";

import { useGuavapayPaymentsContext } from "@/components/Payment/context";
import { GooglePayIcon } from "@/components/icons";

export type GooglePayButtonStyle = "black" | "white";
export type GooglePayButtonType =
  | "standard"
  | "buy"
  | "checkout"
  | "pay"
  | "book"
  | "subscribe";

export interface GooglePayButtonProps {
  onPress: () => void;
  disabled?: boolean;
  buttonStyle?: GooglePayButtonStyle;
  buttonType?: GooglePayButtonType;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const GooglePayButton: React.FC<GooglePayButtonProps> = ({
  onPress,
  disabled = false,
  buttonStyle = "black",
  buttonType = "standard",
  style = {},
  textStyle = {},
}) => {
  const {
    strings: { platformPayText },
  } = useGuavapayPaymentsContext();

  // Only render on Android
  if (Platform.OS !== "android") {
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
      case "checkout":
        return "Check out with";
      case "pay":
        return "Pay with";
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
    return buttonStyle === "black" ? styles.blackButton : styles.whiteButton;
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
      accessibilityLabel="Google Pay button"
    >
      {getButtonText() && (
        <Text style={[styles.buttonText, getTextColorStyle(), textStyle]}>
          {getButtonText()}
        </Text>
      )}
      <View style={[styles.logo]}>
        <GooglePayIcon color={buttonStyle === "black" ? "#fff" : "#000"} />
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  blackButton: {
    backgroundColor: "#000",
  },
  whiteButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dadce0",
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
