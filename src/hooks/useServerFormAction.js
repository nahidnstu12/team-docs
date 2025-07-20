import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useEffect } from "react";
import { useToast } from "@/hooks/useToast";

export function useServerFormAction({
  schema,
  actionFn,
  defaultValues,
  onSuccess,
  onError,
  isDialogOpen = null,
  successToast = {
    title: "Action successful",
    description: "Your request was completed successfully.",
  },
}) {
  const toast = useToast();
  const [errors, setErrors] = useState({});

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const { control, reset, setError, handleSubmit, formState } = form;

  const values = useWatch({ control });

  // Reset when dialog opens
  useEffect(() => {
    if (isDialogOpen !== null && isDialogOpen) {
      reset(defaultValues);
    }
  }, [isDialogOpen, reset, defaultValues]);

  const isFormEmpty = useMemo(() => {
    return Object.values(values || {}).every(
      (value) => value === "" || value === null || value === undefined
    );
  }, [values]);

  const isSubmitDisabled =
    !formState.isValid || isFormEmpty || !form.formState.isDirty || formState.isSubmitting;

  const onSubmit = handleSubmit(async (formData) => {
    const result = await actionFn(formData);

    if (result?.success === false) {
      // Set field-level errors
      Object.entries(result.errors || {}).forEach(([key, msg]) => {
        setError(key, {
          type: "server",
          message: Array.isArray(msg) ? msg[0] : msg,
        });
      });

      setErrors(result.errors);
      onError?.(result.errors);
    }

    if (result?.type === "success") {
      toast.success(successToast.title, successToast.description);
      reset();
      onSuccess?.(result.redirectTo);
    }
  });

  return {
    ...form,
    onSubmit,
    isSubmitDisabled,
    errors,
  };
}
