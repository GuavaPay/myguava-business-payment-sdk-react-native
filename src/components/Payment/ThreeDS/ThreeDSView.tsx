import { useEffect, useRef, useState } from "react";
import WebView from "react-native-webview";

import {
  emitter,
  useGuavapayPaymentsContext,
} from "@/components/Payment/context";

export const ThreeDSView = () => {
  const { continuePayment, order, execute } = useGuavapayPaymentsContext();
  const finishUrl = [
    order.data?.order?.redirectUrl?.replace(/\/$/, ""),
    order.data?.order?.intermediateResultPageOptions?.successMerchantUrl?.replace(
      /\/$/,
      "",
    ),
    order.data?.order?.intermediateResultPageOptions?.unsuccessMerchantUrl?.replace(
      /\/$/,
      "",
    ),
  ].filter(Boolean) as string[];

  const [isFinished, setIsFinished] = useState(false);

  const webViewRef = useRef(null);

  const onCancel = () => {
    setIsFinished(true);
  };

  useEffect(() => {
    emitter.on("cancel3DS", onCancel);

    return () => {
      emitter.off("cancel3DS", onCancel);
    };
  }, []);

  const threedsChallenge =
    execute.data?.requirements?.threedsChallenge ||
    continuePayment.data?.requirements?.threedsChallenge;

  if (!threedsChallenge || isFinished) {
    return null;
  }

  return (
    <WebView
      ref={webViewRef}
      scalesPageToFit
      onLoadStart={(event) => {
        const url = event.nativeEvent.url?.replace(/\/$/, "");
        if (finishUrl.includes(url)) {
          emitter.emit("finish3DS");
          setIsFinished(true);
        }
      }}
      originWhitelist={["*"]}
      source={{
        html: `
          <form id="challenge_form" action='${threedsChallenge?.url}' method='post'>
              <input type='hidden' name='creq' value='${threedsChallenge?.data}'/>
          </form>

          <script>
              document.getElementById("challenge_form").submit();
          </script>
        `,
      }}
    />
  );
};
