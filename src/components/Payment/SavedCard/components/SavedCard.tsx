import cardValidator from "card-validator";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { View, Text, TouchableOpacity } from "react-native";
import ReanimatedSwipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import { SharedValue } from "react-native-reanimated";

import { ActionButton } from "./ActionButton";
import { LeftAction } from "./LeftAction";
import { CardCvvIcon, PaymentIcons } from "../../../icons";
import { BindingNameField } from "../../components/SaveCardInput";
import { TextInputField } from "../../components/TextInputField";
import { useGuavapayPaymentsContext } from "../../context";

import { Binding } from "@/hooks/api/useBindigs";
import { useDeleteBinding } from "@/hooks/api/useDeleteBinding";
import { useUpdateBinding } from "@/hooks/api/useUpdateBinding";

export const SavedCard = ({
  binding,
  isSelected,
  onBindingSelect,
}: {
  binding: Binding;
  isSelected: boolean;
  onBindingSelect: (binding?: Binding) => void;
}) => {
  const { theme, isLoading, strings, setPaymentDisabled, is3DSRequired } =
    useGuavapayPaymentsContext();
  const {
    setValue,
    watch,
    formState: { isValid },
  } = useFormContext();
  const Icon =
    PaymentIcons[binding.cardData.cardScheme as keyof typeof PaymentIcons] ||
    View;
  const [action, setAction] = useState<"rename" | "delete" | "default">(
    "default",
  );
  const {
    mutate: updateBinding,
    isPending: isUpdatingBinding,
    isSuccess: isUpdatingBindingSuccess,
  } = useUpdateBinding();
  const {
    mutate: deleteBinding,
    isPending: isDeletingBinding,
    isSuccess: isDeletingBindingSuccess,
  } = useDeleteBinding();

  useEffect(() => {
    if (isUpdatingBindingSuccess) {
      setAction("default");
    }
  }, [isUpdatingBindingSuccess]);

  useEffect(() => {
    if (isDeletingBindingSuccess) {
      setAction("default");
    }
  }, [isDeletingBindingSuccess]);

  const cardMask = `*${binding.cardData.maskedPan.split("*").at(-1)}`;

  const bindingNameField = `bindingName${binding.id}`;
  const bindingName = watch(bindingNameField);

  useEffect(() => {
    if (isLoading && action !== "default") {
      setAction("default");
    }
  }, [isLoading, action]);

  useEffect(() => {
    if (action !== "default") {
      setPaymentDisabled(true);
    } else {
      setPaymentDisabled(false);
    }

    if (action === "rename") {
      setValue(bindingNameField, binding.name);
    }
  }, [action]);

  if (action === "rename") {
    return (
      <View
        style={[
          theme.savedCards.binding,
          { flexDirection: "column", alignItems: "center" },
        ]}
      >
        <View style={{ flex: 1, width: "100%" }}>
          <BindingNameField name={bindingNameField} />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            width: "100%",
            gap: theme.common.gap,
          }}
        >
          <ActionButton
            onPress={() => setAction("default")}
            text={strings.cancel}
            variant="default"
          />
          <ActionButton
            disabled={isUpdatingBinding || !isValid}
            onPress={() => {
              updateBinding({ id: binding.id, name: bindingName });
            }}
            text={strings.save}
            variant="default"
          />
        </View>
      </View>
    );
  }

  if (action === "delete") {
    return (
      <View
        style={[
          theme.savedCards.binding,
          { flexDirection: "column", alignItems: "center" },
        ]}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text>
            {strings.deleteCard.replace(
              "{card}",
              `${binding.name} ${cardMask}`,
            )}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: theme.common.spacing,
          }}
        >
          <ActionButton
            onPress={() => setAction("default")}
            text={strings.cancel}
            variant="default"
          />
          <ActionButton
            disabled={isDeletingBinding}
            onPress={() => {
              deleteBinding({ id: binding.id });
            }}
            text={strings.delete}
            variant="danger"
          />
        </View>
      </View>
    );
  }

  const renderLeftActions = (
    progress: SharedValue<number>,
    translation: SharedValue<number>,
    swipeableMethods: SwipeableMethods,
  ) => {
    return (
      <LeftAction
        drag={translation}
        onDelete={() => {
          swipeableMethods.close();
          setAction("delete");
        }}
        onRename={() => {
          swipeableMethods.close();
          setAction("rename");
        }}
      />
    );
  };

  const { card } = cardValidator.number(binding.cardData.maskedPan.slice(0, 6));
  const cvvLength = card?.code?.size || 3;

  const savedCardItem = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
      }}
    >
      <TouchableOpacity
        style={[
          theme.savedCards.binding,
          isSelected && theme.savedCards.selectedBinding,
        ]}
        onPress={() => onBindingSelect(binding)}
        disabled={isLoading}
      >
        <View>
          <View
            style={{
              width: 45,
              height: 30,
              padding: 4,
              borderRadius: theme.common.borderRadius,
              borderColor: theme.colors.border,
              borderWidth: 1,
            }}
          >
            <Icon />
          </View>
        </View>
        <View style={{ flexGrow: 1 }}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: theme.common.fontSizeSecondary,
              maxWidth: "80%",
            }}
            numberOfLines={1}
          >
            {binding.name}
          </Text>
          <Text style={{ fontSize: theme.common.fontSizeSecondary }}>
            {cardMask}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={{ height: "100%" }}>
        {isSelected && (
          <TextInputField
            editable={!isLoading}
            autoFocus
            showError={false}
            name="bindingCvv2"
            rules={{
              required: strings.cvv2.required,
              validate: {
                isValid: (value: string) => {
                  return (
                    cardValidator.cvv(value, cvvLength).isValid ||
                    strings.cvv2.invalid
                  );
                },
              },
            }}
            keyboardType="number-pad"
            placeholder={strings.cvv2.placeholder}
            mask={[/\d/, /\d/, /\d/]}
            defaultValue=""
            icon={CardCvvIcon}
            style={{
              width: 120,
              height: "100%",
              flex: 1,
              marginLeft: theme.common.spacing,
            }}
            maxLength={cvvLength}
          />
        )}
      </View>
    </View>
  );

  if (is3DSRequired) {
    return savedCardItem;
  }

  return (
    <ReanimatedSwipeable
      friction={2}
      enableTrackpadTwoFingerGesture
      leftThreshold={40}
      renderLeftActions={renderLeftActions}
      onSwipeableOpenStartDrag={() => {
        onBindingSelect();
      }}
    >
      {savedCardItem}
    </ReanimatedSwipeable>
  );
};
