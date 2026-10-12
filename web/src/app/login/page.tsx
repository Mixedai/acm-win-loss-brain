import { LoginForm } from "@/app/login/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            ACM Win/Loss Intelligence Brain
          </h1>
          <p className="mt-1 text-sm text-slate-500">Internal analytics dashboard</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
