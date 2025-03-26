import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Pressable } from "react-native-gesture-handler";

import { useGuavapayPaymentsContext } from "../../context";

export const LeftAction = ({
  drag,
  onDelete,
  onRename,
}: {
  drag: SharedValue<number>;
  onDelete: () => void;
  onRename: () => void;
}) => {
  const { theme, strings } = useGuavapayPaymentsContext();
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value - 200 }],
    };
  });

  return (
    <Reanimated.View style={styleAnimation}>
      <View
        style={{
          width: 200,
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Pressable
          onPress={onDelete}
          style={[
            theme.secondaryButton.default.button,
            styles.button,
            { borderColor: theme.colors.border },
          ]}
        >
          <Text
            style={[
              theme.secondaryButton.default.text,
              { color: theme.colors.danger },
            ]}
          >
            {strings.delete}
          </Text>
        </Pressable>
        <Pressable
          onPress={onRename}
          style={[
            theme.secondaryButton.default.button,
            styles.button,
            { borderColor: theme.colors.border },
          ]}
        >
          <Text style={theme.secondaryButton.default.text}>
            {strings.rename}
          </Text>
        </Pressable>
      </View>
    </Reanimated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginRight: 5,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
});
