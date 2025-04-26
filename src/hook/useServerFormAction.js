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
	successToast = {
		title: "Action successful",
		description: "Your request was completed successfully.",
	},
}) {
	const hasSuccessRun = useRef(false);
	const [formState, formAction, isPending] = useActionState(actionFn, {
		errors: null,
		data: null,
	});

	const {
		register,
		setError,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(schema),
		defaultValues,
	});

	useEffect(() => {
		if (!formState || hasSuccessRun.current) return;

		// 💥 On Error
		if (formState.success === false && formState.data) {
			hasSuccessRun.current = true;
			reset(formState.data, { keepErrors: true });
			Object.entries(formState.errors || {}).forEach(([field, message]) => {
				setError(field, {
					type: "server",
					message: Array.isArray(message) ? message[0] : message,
				});
			});
			if (formState.errors?._form) {
				toast.error(formState.errors._form[0]);
			}
			return;
		}

		// ✅ On Success
		if (formState.type === "success") {
			hasSuccessRun.current = true;
			reset(defaultValues);
			toast.success(successToast.title, {
				description: successToast.description,
			});
			onSuccess?.(formState.redirectTo);
		}
	}, [
		formState,
		defaultValues,
		setError,
		reset,
		onSuccess,
		successToast.description,
		successToast.title,
	]);

	return {
		register,
		errors,
		formAction,
		isPending,
	};
}
