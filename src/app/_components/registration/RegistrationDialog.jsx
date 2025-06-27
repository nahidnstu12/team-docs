import { useCallback, useMemo } from "react";
import { useRegistrationStore } from "../store/useRegistrationStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { registerNewUser } from "@/system/Actions/RegistrationAction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { RegistrationUserSchema } from "@/lib/schemas/UserSchema";
import { RegistrationWorkspaceSchema } from "@/lib/schemas/workspaceSchema";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useServerFormAction } from "@/hooks/useServerFormAction";

export default function RegistrationDialog({ isAuthenticated }) {
  const { isOpen, closeDialog } = useRegistrationStore();

  const defaultValues = useMemo(() => {
    if (isAuthenticated) {
      return {
        workspaceName: "",
        workspaceDescription: "",
      };
    }

    return {
      username: "",
      email: "",
      password: "",
      workspaceName: "",
      workspaceDescription: "",
    };
  }, [isAuthenticated]);

  const registrationSchema = useMemo(() => {
    if (isAuthenticated) {
      return z.object({
        workspaceName: RegistrationWorkspaceSchema.shape.name,
        workspaceDescription: RegistrationWorkspaceSchema.shape.description,
      });
    }

    return z.object({
      username: RegistrationUserSchema.shape.username,
      email: RegistrationUserSchema.shape.email,
      password: RegistrationUserSchema.shape.password,
      workspaceName: RegistrationWorkspaceSchema.shape.name,
      workspaceDescription: RegistrationWorkspaceSchema.shape.description,
    });
  }, [isAuthenticated]);

  const successToast = useMemo(
    () => ({
      title: "Registration submitted",
      description: "Your registration is pending approval. We'll notify you soon.",
    }),
    []
  );

  const handleSuccess = useCallback(() => {
    // Handle success - no redirect needed as we'll show the confirmation dialog
  }, []);

  const { register, errors, formAction, isPending, isSubmitDisabled, formState } =
    useServerFormAction({
      schema: registrationSchema,
      actionFn: registerNewUser,
      defaultValues,
      successToast,
      onSuccess: handleSuccess,
      isDialogOpen: isOpen,
    });

  // If form was successfully submitted, show the pending confirmation dialog
  if (formState?.type === "success") {
    return <PendingConfirmationDialog />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent
        className={`w-full ${
          isAuthenticated ? "!max-w-[40vw]" : "!max-w-[70vw]"
        } h-[85vh] max-h-[90vh] overflow-y-auto`}
      >
        <DialogHeader className="space-y-1 text-center">
          <DialogTitle className="text-3xl font-semibold leading-3 text-center">
            Get Started
          </DialogTitle>
          <DialogDescription className="font-light text-center">
            Create your first workspace to get started.
          </DialogDescription>
        </DialogHeader>

        {errors._form && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>{errors._form.message}</AlertDescription>
          </Alert>
        )}

        <form action={formAction} className="space-y-6">
          {isAuthenticated ? (
            <div className="space-y-4">
              <h3 className="pb-2 text-xl font-semibold border-b">Workspace Information</h3>
              <div className="space-y-1.5">
                <Label htmlFor="workspaceName">Workspace Name</Label>
                <Input
                  id="workspaceName"
                  placeholder="My Team"
                  className="h-11"
                  {...register("workspaceName")}
                />
                {errors.workspaceName && (
                  <p className="mt-1 text-sm text-red-500">{errors.workspaceName.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="workspaceDescription">
                  Description <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Textarea
                  id="workspaceDescription"
                  placeholder="A brief description of your team or organization"
                  className="min-h-[120px]"
                  {...register("workspaceDescription")}
                />
                {errors.workspaceDescription && (
                  <p className="mt-1 text-sm text-red-500">{errors.workspaceDescription.message}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 w-full md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="pb-2 text-xl font-semibold border-b">User Information</h3>
                <div className="space-y-1.5">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="johndoe"
                    className="h-11"
                    {...register("username")}
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="h-11"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••••"
                    className="h-11"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="pb-2 text-xl font-semibold border-b">Workspace Information</h3>
                <div className="space-y-1.5">
                  <Label htmlFor="workspaceName">Workspace Name</Label>
                  <Input
                    id="workspaceName"
                    placeholder="My Team"
                    className="h-11"
                    {...register("workspaceName")}
                  />
                  {errors.workspaceName && (
                    <p className="mt-1 text-sm text-red-500">{errors.workspaceName.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="workspaceDescription">
                    Description <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Textarea
                    id="workspaceDescription"
                    placeholder="A brief description of your team or organization"
                    className="min-h-[120px]"
                    {...register("workspaceDescription")}
                  />
                  {errors.workspaceDescription && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.workspaceDescription.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-center pt-2">
            <Button type="submit" size="lg" disabled={isSubmitDisabled} className="min-w-[220px]">
              {isPending
                ? "Processing..."
                : isAuthenticated
                ? "Create Workspace"
                : "Create Account"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PendingConfirmationDialog() {
  const { isOpen, closeDialog } = useRegistrationStore();

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="max-w-md text-center">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-center">Registration Pending</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center py-6 space-y-4">
          <div className="flex relative justify-center items-center w-24 h-24 rounded-full bg-muted">
            <AlertCircle className="w-12 h-12 animate-pulse text-primary" />
          </div>

          <div className="space-y-3">
            <p className="text-lg font-medium">Thank you for your registration!</p>
            <p className="text-muted-foreground">
              We&apos;ll review your information and send a confirmation email once approved. This
              process typically takes 24-48 hours.
            </p>
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <Button onClick={closeDialog}>I Understand</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
