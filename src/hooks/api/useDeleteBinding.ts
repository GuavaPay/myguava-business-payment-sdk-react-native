import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { refetchBindings } from "./useBindigs";

import { api, ApiError } from "@/clients";

export type DeleteBindingRequest = {
  id: string;
};

const deleteBinding = async ({ id }: DeleteBindingRequest) => {
  const response = await api<unknown>(`/binding/${id}`, {
    method: "DELETE",
  });

  return response.data;
};

export const useDeleteBinding = (
  options?: UseMutationOptions<unknown, ApiError, DeleteBindingRequest>,
) => {
  return useMutation({
    mutationFn: (req: DeleteBindingRequest) => deleteBinding(req),
    onSuccess(data, variables, context) {
      options?.onSuccess?.(data, variables, context);
      refetchBindings();
    },
    ...options,
  });
};
