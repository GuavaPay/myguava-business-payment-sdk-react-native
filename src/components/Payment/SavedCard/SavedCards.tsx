import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { useGuavapayPaymentsContext } from "../context";
import { SavedCard } from "./components";

import { Binding, useBindings } from "@/hooks/api/useBindigs";

export const SavedCards = ({
  selectedBinding,
  onBindingSelect,
}: {
  selectedBinding?: Binding;
  onBindingSelect: (binding?: Binding) => void;
}) => {
  const { hasBindings, theme } = useGuavapayPaymentsContext();

  const {
    data: { accepted },
  } = useBindings(
    {},
    {
      enabled: hasBindings,
    },
  );

  const { setValue } = useFormContext();

  useEffect(() => {
    setValue("bindingCvv2", "");
  }, [selectedBinding]);

  if (!hasBindings) return null;

  return (
    <GestureHandlerRootView>
      <View style={theme.savedCards.container}>
        {accepted?.map((binding) => (
          <SavedCard
            key={binding.id}
            binding={binding}
            isSelected={selectedBinding?.id === binding.id}
            onBindingSelect={onBindingSelect}
          />
        ))}
      </View>
    </GestureHandlerRootView>
  );
};
