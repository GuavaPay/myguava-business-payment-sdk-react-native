import { useEffect } from "react";

import { emitter } from "@/components/Payment/context";

export const use3DS = ({
  onStart,
  onFinish,
}: {
  onStart?: () => void;
  onFinish?: () => void;
}) => {
  useEffect(() => {
    emitter.on("start3DS", onStart);
    emitter.on("finish3DS", onFinish);

    return () => {
      emitter.off("start3DS", onStart);
      emitter.off("finish3DS", onFinish);
    };
  }, []);

  const cancel = () => {
    emitter.emit("cancel3DS");
  };

  return {
    cancel,
  };
};
