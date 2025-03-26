import { getLocales } from "expo-localization";
import { Dimensions } from "react-native";

export const getDeviceData = () => {
  const locales = getLocales();
  const language = locales[0].languageCode || "en";

  return {
    deviceData: {
      browserData: {
        timeZoneOffset: new Date().getTimezoneOffset(),
        screenHeight: Dimensions.get("window").height,
        screenWidth: Dimensions.get("window").width,
        screenColorDepth: 24,
        language,
      },
    },
  };
};
