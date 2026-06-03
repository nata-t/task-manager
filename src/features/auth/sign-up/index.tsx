import { SignUpForm } from "./sections/sign-up-form";
import { Scene } from "./sections/scene";
import Link from "next/link";

export default function Index() {
  return (
    <main className="grid h-dvh w-full grid-cols-1 overflow-hidden bg-background lg:grid-cols-2">
      <div className="relative hidden min-h-0 min-w-0 overflow-hidden border-r border-white/10 lg:block">
        <Scene />
      </div>

      <div className="flex min-h-0 min-w-0 items-center justify-center overflow-hidden bg-background px-6 py-8 sm:px-8 lg:px-16 xl:px-24">
        <div className="w-full max-w-100 space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              Create an account
            </h1>
            <p className="text-muted-foreground">
              Enter your details to get started
            </p>
          </div>
          <SignUpForm />
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
