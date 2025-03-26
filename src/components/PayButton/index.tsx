import { useEffect, useState } from "react";

import { emitter, EventFormType } from "../Payment";

export const PayButton = ({
  children,
  type,
}: {
  children: (
    submit: () => void,
    isDisabled: boolean,
    isLoading: boolean,
  ) => React.ReactNode;
  type: EventFormType;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const submit = () => {
    emitter.emit("submit", type);
  };

  const setState = (state: {
    type: EventFormType;
    isLoading: boolean;
    isDisabled: boolean;
  }) => {
    if (state.type === type) {
      setIsLoading(state.isLoading);
      setIsDisabled(state.isDisabled);
    }
  };

  useEffect(() => {
    emitter.emit("getState");

    emitter.on("setState", setState);

    return () => {
      emitter.off("setState", setState);
    };
  }, []);

  return children(submit, isDisabled, isLoading);
};
