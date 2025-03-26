import { ViewStyle, TextStyle } from "react-native";

import { DeepPartial } from "../types";

import { ApplePayButtonProps } from "@/components/Payment/PlatformPay/buttons/ApplePayButton";
import { GooglePayButtonProps } from "@/components/Payment/PlatformPay/buttons/GooglePayButton";
import { mergeDeep } from "@/utils";

type CommonProp =
  | "borderRadius"
  | "borderWidth"
  | "fontSize"
  | "fontSizeSecondary"
  | "fontSizeSmall"
  | "gap"
  | "spacing"
  | "height"
  | "padding"
  | "iconSize";

type ColorProp =
  | "primary"
  | "background"
  | "border"
  | "text"
  | "danger"
  | "placeholder"
  | "disabled";

type ThemeInput = {
  default: TextStyle;
  focused: TextStyle;
  invalid: TextStyle;
  icon: ViewStyle;
  iconContainer: ViewStyle;
  errorText: TextStyle;
};

type ThemeModal = { header: ViewStyle; title: TextStyle; cancel: TextStyle };

type ButtonStyle = { button: ViewStyle; text: TextStyle };
type ThemeButton = { default: ButtonStyle; disabled: ButtonStyle };

type ThemeSavedCards = {
  container: ViewStyle;
  binding: ViewStyle;
  selectedBinding: ViewStyle;
};

type ThemeCheckbox = { default: ViewStyle; checked: ViewStyle };

export type Theme = {
  common: Record<CommonProp, number>;
  colors: Record<ColorProp, string>;
  input: ThemeInput;
  label: TextStyle;
  modal: ThemeModal;
  payButton: ThemeButton;
  secondaryButton: ThemeButton;
  applePayButton: Omit<ApplePayButtonProps, "onPress" | "disabled">;
  googlePayButton: Omit<GooglePayButtonProps, "onPress" | "disabled">;
  savedCards: ThemeSavedCards;
  checkbox: ThemeCheckbox;
};

export type ThemePartial = DeepPartial<Theme>;

type GenerateThemeProps = {
  common: Theme["common"];
  colors: Theme["colors"];
};

const generateInputTheme = ({
  common,
  colors,
}: GenerateThemeProps): Theme["input"] => {
  return {
    default: {
      borderWidth: common.borderWidth,
      borderColor: colors.border,
      paddingHorizontal: common.padding,
      borderRadius: common.borderRadius,
      height: common.height,
      fontSize: common.fontSize,
      backgroundColor: colors.background,
    },
    focused: {
      borderColor: colors.primary,
    },
    invalid: {
      borderColor: colors.danger,
    },
    iconContainer: {
      position: "absolute",
      right: common.spacing,
      top: 0,
      bottom: 0,
      zIndex: 4,
      justifyContent: "center",
      alignItems: "center",
    },
    icon: {
      width: common.iconSize,
      height: common.iconSize,
    },
    errorText: {
      color: colors.danger,
      fontSize: common.fontSizeSmall,
      marginTop: 2,
    },
  };
};

const generateLabelTheme = ({ common, colors }: GenerateThemeProps): Theme["label"] => {
  return {
    fontSize: common.fontSizeSecondary,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 5,
  };
};

const generatePayButtonTheme = ({
  common,
  colors,
}: GenerateThemeProps): Theme["payButton"] => {
  return {
    default: {
      button: {
        marginTop: common.spacing,
        backgroundColor: colors.primary,
        borderRadius: common.borderRadius,
        justifyContent: "center",
        alignItems: "center",
        padding: common.padding,
        height: common.height,
      },
      text: {
        color: colors.text,
        fontSize: common.fontSize,
        fontWeight: "bold",
      },
    },
    disabled: {
      button: {
        backgroundColor: colors.disabled,
      },
      text: {
        color: colors.text,
      },
    },
  };
};

const generateSecondaryButtonTheme = ({
  common,
  colors,
}: GenerateThemeProps): Theme["secondaryButton"] => {
  return {
    default: {
      button: {
        borderWidth: common.borderWidth,
        borderColor: colors.text,
        borderRadius: common.borderRadius,
        justifyContent: "center",
        alignItems: "center",
        padding: common.padding,
        height: common.height,
      },
      text: {
        color: colors.text,
        fontSize: common.fontSize,
        fontWeight: "bold",
      },
    },
    disabled: {
      button: {
        backgroundColor: colors.disabled,
      },
      text: {
        color: colors.text,
      },
    },
  };
};

const generateModalTheme = ({
  common,
  colors,
}: GenerateThemeProps): Theme["modal"] => {
  return {
    header: {
      height: common.height,
      backgroundColor: colors.background,
      borderBottomWidth: common.borderWidth,
      borderBottomColor: colors.border,
      position: "relative",
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: common.fontSize,
      fontWeight: "700",
    },
    cancel: {
      color: "#0984ff",
      fontSize: common.fontSize,
      fontWeight: "500",
    },
  };
};

const generateApplePayButtonTheme = ({
  common,
  colors,
}: GenerateThemeProps): Theme["applePayButton"] => {
  return {
    buttonStyle: "black",
    buttonType: "plain",
    style: {},
    textStyle: {},
  };
};

const generateGooglePayButtonTheme = ({
  common,
  colors,
}: GenerateThemeProps): Theme["googlePayButton"] => {
  return {
    buttonStyle: "black",
    buttonType: "standard",
    style: {},
    textStyle: {},
  };
};

const generateSavedCardsTheme = ({
  common,
  colors,
}: GenerateThemeProps): Theme["savedCards"] => {
  return {
    container: {
      padding: 0,
      gap: common.spacing,
    },
    binding: {
      padding: common.padding,
      borderWidth: common.borderWidth,
      borderColor: colors.border,
      borderRadius: common.borderRadius,
      flexDirection: "row",
      alignItems: "center",
      gap: common.spacing,
      flex: 1,
    },
    selectedBinding: {
      borderColor: colors.primary,
    },
  };
};

const generateCheckboxTheme = ({
  common,
  colors,
}: GenerateThemeProps): Theme["checkbox"] => {
  return {
    default: {
      width: 20,
      height: 20,
      padding: 2,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: colors.text,
    },
    checked: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
  };
};

export const generateTheme = (theme: ThemePartial): Theme => {
  const common = {
    borderRadius: 4,
    borderWidth: 1,
    fontSize: 16,
    fontSizeSecondary: 14,
    fontSizeSmall: 12,
    gap: 16,
    spacing: 10,
    height: 48,
    padding: 10,
    iconSize: 30,
    ...theme.common,
  };

  const colors = {
    primary: "#bcf502",
    background: "#f8f8f8",
    border: "#ededed",
    text: "#000",
    danger: "#cd2b31",
    placeholder: "#a8a8a8",
    disabled: "#dedede",
    ...theme.colors,
  };

  const defaultTheme = {
    common,
    colors,
    input: generateInputTheme({ common, colors }),
    label: generateLabelTheme({ common, colors }),
    modal: generateModalTheme({ common, colors }),
    payButton: generatePayButtonTheme({ common, colors }),
    secondaryButton: generateSecondaryButtonTheme({ common, colors }),
    applePayButton: generateApplePayButtonTheme({ common, colors }),
    googlePayButton: generateGooglePayButtonTheme({ common, colors }),
    savedCards: generateSavedCardsTheme({ common, colors }),
    checkbox: generateCheckboxTheme({ common, colors }),
  };

  return mergeDeep(defaultTheme, (theme || {}) as Theme);
};
