"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Button from "@/components/ui/Button";
import Toast, { useToast } from "@/components/ui/Toast";
import type { Database } from "@/lib/types/supabase";

interface AuthFormProps {
  mode: "sign-in" | "sign-up";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const { toast, showToast } = useToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "sign-in") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        showToast("Signed in successfully!");
        router.refresh();
        router.push("/gallery");
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        if (data?.session) {
          showToast("Account created successfully!");
          router.refresh();
          router.push("/gallery");
        } else {
          showToast("Account created. Please check your email, then sign in.");
          router.push("/sign-in");
        }
      }
    } catch (err: any) {
      showToast(err.message ?? "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4">
      <h2 className="text-2xl font-semibold">
        {mode === "sign-in" ? "Sign in" : "Create an account"}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span>Email</span>
          <input
            type="email"
            className="rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-primary"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span>Password</span>
          <input
            type="password"
            className="rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-primary"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            required
          />
        </label>
        <Button type="submit" disabled={loading} className="w-full">
          {loading
            ? "Please wait…"
            : mode === "sign-in"
            ? "Sign in"
            : "Sign up"}
        </Button>
      </form>
      <p className="text-sm text-slate-400">
        {mode === "sign-in" ? (
          <>
            Don&apos;t have an account?{" "}
            <a href="/sign-up" className="text-primary underline">
              Sign up
            </a>
            .
          </>
        ) : (
          <>
            Already have an account?{" "}
            <a href="/sign-in" className="text-primary underline">
              Sign in
            </a>
            .
          </>
        )}
      </p>
      <Toast message={toast.message} open={toast.open} />
    </div>
  );
}
