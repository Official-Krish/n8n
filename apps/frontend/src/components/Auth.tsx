import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiSignin, apiSignup } from "@/http";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Auth({ mode }: { mode: "signin" | "signup" }) {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        await apiSignup({ username, password });
      }
      await apiSignin({ username, password });
      nav("/create");
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm border rounded-lg p-6">
        <h1 className="text-xl font-semibold">
          {mode === "signin" ? "Sign in" : "Create account"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          This is required because workflows are stored per-user.
        </p>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="yourname"
              autoComplete="username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
            />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <Button
            className="w-full"
            onClick={onSubmit}
            disabled={loading || !username || !password}
          >
            {loading
              ? "Working..."
              : mode === "signin"
                ? "Sign in"
                : "Sign up + Sign in"}
          </Button>

          <div className="text-sm text-muted-foreground">
            {mode === "signin" ? (
              <button
                className="underline"
                onClick={() => nav("/signup")}
                type="button"
              >
                Need an account? Sign up
              </button>
            ) : (
              <button
                className="underline"
                onClick={() => nav("/signin")}
                type="button"
              >
                Already have an account? Sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


