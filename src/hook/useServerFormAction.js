import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useRef } from "react";
import { useEffect } from "react";
import { toast } from "sonner";

export function useServerFormAction({
	schema,
	actionFn,
	defaultValues,
	onSuccess,
	onError,
	onSettled,
	successToast = {
		title: "Action successful",
		description: "Your request was completed successfully.",
	},
	errorToast = {
		title: "Action failed",
		description: "There was an error processing your request.",
	},
}) {
	const hasHandled = useRef(false);
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
		formState: { errors },
	} = useForm({
		resolver: zodResolver(schema),
		defaultValues,
	});

	useEffect(() => {
		if (!formState || hasHandled.current) return;

		if (formState.success === false) {
			hasHandled.current = true;
			reset(formState.data, { keepErrors: true });
			Object.entries(formState.errors || {}).forEach(([field, message]) => {
				setError(field, {
					type: "server",
					message: Array.isArray(message) ? message[0] : message,
				});
			});
			if (formState.errors?._form) {
				toast.error(formState.errors._form[0]);
			} else {
				toast.error(errorToast.title, {
					description: errorToast.description,
				});
			}
			onError?.(formState.errors);
		}

		if (formState.type === "success") {
			hasHandled.current = true;
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
	};
}
