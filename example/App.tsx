import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  GuavapayPayments,
  createOrder,
  OrderDetailsResponse,
} from "@guavapay/myguava-business-payment-sdk-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EnvironmentEnum } from "@rnw-community/react-native-payments";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const orderRequest = {
  description: {
    textDescription: "Order description",
  },
  totalAmount: {
    baseUnits: "6.00",
    currency: "GBP",
  },
  payer: {
    id: "52",
    contactEmail: "test-example@example.com",
    contactPhone: {
      fullNumber: "+994111111111",
    },
  },
};

export default function App() {
  const [order, setOrder] = useState<OrderDetailsResponse | null>(null);
  const [status, setStatus] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string[]>([]);

  const createAndSaveOrder = async (withPayer = true) => {
    const order = await createOrder(process.env.EXPO_PUBLIC_API_KEY, {
      ...orderRequest,
      ...(!withPayer && {
        payer: {
          id: orderRequest.payer.id,
        },
      }),
    });
    await AsyncStorage.setItem("order", JSON.stringify(order));
    setOrder(order);
    setStatus("");
  };

  const getOrder = async () => {
    const order = await AsyncStorage.getItem("order");
    if (order) {
      setOrder(JSON.parse(order));
    } else {
      await createAndSaveOrder();
    }
  };

  useEffect(() => {
    getOrder();
  }, []);

  const createOrderButton = (
    <View style={{ flexDirection: "row", gap: 1 }}>
      <TouchableOpacity
        onPress={() => createAndSaveOrder(true)}
        style={{
          flex: 1,
          backgroundColor: "#000",
          padding: 10,
          borderRadius: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff" }}>Create with payer</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => createAndSaveOrder(false)}
        style={{
          flex: 1,
          backgroundColor: "#000",
          padding: 10,
          borderRadius: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff" }}>Create without payer</Text>
      </TouchableOpacity>
    </View>
  );

  if (status === "error") {
    return (
      <SafeAreaView>
        {createOrderButton}
        <View style={[styles.block, styles.error]}>
          <MaterialIcons color="#333" name="error" size={100} />
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>
            Payment failed
          </Text>
          <View style={{ marginTop: 10 }}>
            {errorMessage.map((message, index) => (
              <Text key={index} style={{ textAlign: "left", maxWidth: "100%" }}>
                {message}
              </Text>
            ))}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (status === "success") {
    return (
      <SafeAreaView>
        {createOrderButton}
        <View style={[styles.block, styles.success]}>
          <MaterialIcons color="#333" name="check-circle" size={100} />
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>Success</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView>
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView keyboardShouldPersistTaps="never">
        <SafeAreaView>
          {createOrderButton}

          <View
            style={[
              styles.container,
              {
                margin: 10,
                backgroundColor: "#fff",
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#d7d8d9",
              },
            ]}
          >
            <GuavapayPayments
              strings={{
                pay: "Buy now",
              }}
              theme={{
                applePayButton: {
                  buttonStyle: "white-outline",
                },
                googlePayButton: {
                  buttonStyle: "white",
                  style: {
                    borderColor: "#000",
                  },
                },
                colors: {
                  primary: "#2abdff",
                },
                common: {
                  borderRadius: 6,
                },
              }}
              orderId={order.order.id}
              sessionToken={order.order.sessionToken as string}
              onComplete={(order) => {
                if (order.order.status === "PAID") {
                  setStatus("success");
                } else {
                  setStatus("error");
                  setErrorMessage([
                    `Status: ${order.order.status}`,
                    `Result: ${order.payment?.result?.message}`,
                  ]);
                }
              }}
              onError={({ error, canRetry, order }) => {
                console.log("onPaymentError", error);

                if (canRetry) {
                  alert("Error, please try again");
                } else {
                  setStatus("error");
                  setErrorMessage([
                    `Status: ${order?.order?.status}`,
                    `Error: ${error?.message || "Unknown error"}`,
                    `Message: ${error?.data?.message}`,
                  ]);
                }
              }}
              applePayConfig={{
                merchantIdentifier: "merchant.com.guavapay.epg",
              }}
              googlePayConfig={{
                environment: EnvironmentEnum.TEST,
                gatewayConfig: {
                  gateway: "guavapay",
                  gatewayMerchantId: "nuveidigital",
                },
              }}
            // env="preprod"
            />
          </View>

          {/* <PayButton type="savedCard">
            {(submit, isDisabled, isLoading) => (
              <TouchableOpacity onPress={submit} disabled={isDisabled}>
                <Text>{isLoading ? "Loading..." : "Pay"}</Text>
              </TouchableOpacity>
            )}
          </PayButton> */}
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  block: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    margin: 24,
  },
  error: {
    backgroundColor: "#fb9090",
    borderWidth: 2,
    borderColor: "red",
  },
  success: {
    backgroundColor: "#90fb90",
    borderWidth: 2,
    borderColor: "green",
  },
});
