import {
  ActivityIndicator,
  TouchableOpacity,
  Text,
  TouchableOpacityProps,
} from "react-native";

import { useGuavapayPaymentsContext } from "../../context";

export const ActionButton = ({
  onPress,
  text,
  isLoading,
  variant,
  ...props
}: {
  onPress: () => void;
  text: string;
  isLoading?: boolean;
  variant?: "default" | "danger";
} & TouchableOpacityProps) => {
  const { theme } = useGuavapayPaymentsContext();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        theme.secondaryButton.default.button,
        { height: 40, width: 80 },
        variant === "danger" && { borderColor: theme.colors.danger },
      ]}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={theme.colors.text} />
      ) : (
        <Text
          style={[
            theme.secondaryButton.default.text,
            { fontSize: theme.common.fontSizeSecondary },
            variant === "danger" && { color: theme.colors.danger },
          ]}
        >
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};
