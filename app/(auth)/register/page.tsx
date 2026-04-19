import AuthForm from "@/components/auth/AuthForm";
import AuthShell from "@/components/auth/AuthShell";

export default function RegisterPage() {
  return (
    <AuthShell mode="register">
      <AuthForm type="register" />
    </AuthShell>
  );
}
