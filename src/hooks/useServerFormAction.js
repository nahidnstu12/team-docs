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
    mode: "onChange", // validate on every input change
    reValidateMode: "onChange",
  });

  const { control, reset, setError, handleSubmit, formState } = form;

  // Watches all form values reactively
  const values = useWatch({ control });

  // Reset form whenever dialog opens
  useEffect(() => {
    if (isDialogOpen !== null && isDialogOpen) {
      reset(defaultValues);
    }
  }, [isDialogOpen, reset, defaultValues]);

  // Check if form is entirely empty
  const isFormEmpty = useMemo(() => {
    return Object.values(values || {}).every(
      (value) => value === "" || value === null || value === undefined
    );
  }, [values]);

  // Compute disabled state for submit button
  const isSubmitDisabled =
    !formState.isValid || // fails zod validation
    isFormEmpty ||
    !form.formState.isDirty || // nothing changed from default
    formState.isSubmitting;

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
