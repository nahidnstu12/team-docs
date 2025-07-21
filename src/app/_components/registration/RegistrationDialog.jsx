import { useMemo } from "react";
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
import { z } from "zod";
import { RegistrationUserSchema } from "@/lib/schemas/UserSchema";
import { RegistrationWorkspaceSchema } from "@/lib/schemas/workspaceSchema";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useServerFormAction } from "@/hooks/useServerFormAction";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function RegistrationDialog({ isAuthenticated }) {
  const { isFormDialogOpen, closeFormDialog, setRegistrationSuccess } = useRegistrationStore();

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

  const form = useServerFormAction({
    schema: registrationSchema,
    actionFn: registerNewUser,
    onSuccess: (redirectTo, data) => setRegistrationSuccess(data),
    defaultValues,
    isDialogOpen: isFormDialogOpen,
    successToast: null,
  });

  return (
    <>
      <PendingConfirmationDialog />
      <Dialog open={isFormDialogOpen} onOpenChange={closeFormDialog}>
        <DialogContent
          className={`w-full ${
            isAuthenticated ? "!max-w-[40vw]" : "!max-w-[80vw]"
          } h-[85vh] max-h-[90vh] overflow-y-auto`}
        >
          <DialogHeader className="space-y-1 text-center">
            <DialogTitle className="text-4xl font-semibold leading-3 text-center">
              Get Started
            </DialogTitle>
            <DialogDescription className="font-light text-center text-lg mt-2">
              Create your first workspace to get started.
            </DialogDescription>
          </DialogHeader>

          {form.formState.errors._form && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{form.formState.errors._form[0]}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.onSubmit} className="space-y-12">
              {isAuthenticated ? (
                <div className="space-y-4">
                  <h3 className="pb-2 text-xl font-semibold border-b">Workspace Information</h3>
                  <FormField
                    control={form.control}
                    name="workspaceName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workspace Name</FormLabel>
                        <FormControl>
                          <Input placeholder="My Team" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="workspaceDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={5}
                            placeholder="A brief description of your team or organization"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-10 w-full md:grid-cols-2">
                  <div className="space-y-4 border-r border-gray-200 pr-8">
                    <h3 className="pb-2 text-xl font-semibold border-b">User Information</h3>
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="johndoe" className="h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="john@example.com" className="h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input placeholder="••••••••••" className="h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-4">
                    <h3 className="pb-2 text-xl font-semibold border-b">Workspace Information</h3>
                    <FormField
                      control={form.control}
                      name="workspaceName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Workspace Name</FormLabel>
                          <FormControl>
                            <Input placeholder="My Team" className="h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="workspaceDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Description <span className="text-muted-foreground">(optional)</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="A brief description of your team or organization"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
              <div className="flex justify-center pt-2">
                <Button
                  type="submit"
                  size="lg"
                  disabled={form.isSubmitDisabled}
                  className="min-w-[220px]"
                >
                  {form.formState.isSubmitting
                    ? "Processing..."
                    : isAuthenticated
                    ? "Create Workspace"
                    : "Create Account"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function PendingConfirmationDialog() {
  const { isPendingDialogOpen, closePendingDialog, resetRegistrationState } =
    useRegistrationStore();

  // if (!openSecondDialog) return null;

  const handleClose = () => {
    resetRegistrationState();
    closePendingDialog(); // ✅ properly close second dialog
  };

  return (
    <Dialog open={isPendingDialogOpen} onOpenChange={handleClose}>
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
          <Button onClick={handleClose}>I Understand</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
