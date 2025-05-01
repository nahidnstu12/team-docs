import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useMemo, useRef } from "react";
import { useEffect } from "react";
import { toast } from "sonner";

export function useServerFormAction({
	schema,
	actionFn,
	defaultValues,
	onSuccess,
	onError,
	onSettled,
	isDialogOpen = null,
	successToast = {
		title: "Action successful",
		description: "Your request was completed successfully.",
	},
	errorToast = {
		title: "Action failed",
		description: "There was an error processing your request.",
	},
}) {
	const [formState, formAction, isPending] = useActionState(actionFn, {
		errors: null,
		data: null,
	});

	const {
		control,
		register,
		setError,
		reset,
		watch,
		setValue,
		formState: { errors, isValid, isSubmitting },
	} = useForm({
		resolver: zodResolver(schema),
		defaultValues,
		mode: "onChange",
		reValidateMode: "onChange",
	});

	// Track the last processed form state
	const lastProcessedState = useRef(null);

	// Track all form values to check if empty
	const formValues = watch();
	const isFormEmpty = useMemo(() => {
		return Object.values(formValues).every(
			(value) => value === "" || value === null || value === undefined
		);
	}, [formValues]);

	// Disable when form is empty OR when submitting
	const isSubmitDisabled = !isValid || isFormEmpty || isPending || isSubmitting;

	// Handle dialog open/close reset logic inside the hook
	useEffect(() => {
		if (isDialogOpen !== null && isDialogOpen) {
			reset(defaultValues);
		}
	}, [isDialogOpen, reset, defaultValues]);

	useEffect(() => {
		if (!formState || formState === lastProcessedState.current) return;

		// Mark this state as processed
		lastProcessedState.current = formState;

		if (formState.success === false) {
			// Reset form with submitted values but keep errors
			reset(formState.data, { keepErrors: true });
			Object.entries(formState.errors || {}).forEach(([field, message]) => {
				setError(field, {
					type: "server",
					message: Array.isArray(message) ? message[0] : message,
				});
			});
			// Show form-level error toast only if _form exists
			if (formState.errors?._form) {
				toast.error(formState.errors._form[0]);
			} else if (Object.keys(formState.errors || {}).length > 0) {
				// Only show generic error toast if there are errors but no _form error
				toast.error(errorToast.title, {
					description: errorToast.description,
				});
			}
			onError?.(formState.errors);
		}

		if (formState.type === "success") {
			reset(defaultValues); // optional depending on your need
			if (successToast) {
				toast.success(successToast.title, {
					description: successToast.description,
				});
			}
			onSuccess?.(formState.redirectTo);
		}

		onSettled?.();
	}, [
		formState,
		defaultValues,
		setError,
		reset,
		onSuccess,
		onError,
		onSettled,
		successToast,
		errorToast,
	]);

	return {
		control,
		register,
		errors,
		formAction,
		isPending,
		reset,
		watch,
		setValue,
		formState,
		isSubmitDisabled,
	};
}
