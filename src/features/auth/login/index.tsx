import { LoginForm } from "./sections/login-form";
import { Scene } from "./sections/scene"; // Adjust path as needed
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
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <LoginForm />

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
