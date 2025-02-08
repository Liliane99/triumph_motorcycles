"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError("Email ou mot de passe incorrect.");
    }
    setLoading(false);
  };

  return (
    <div
      className={cn("grid h-screen w-full md:grid-cols-2", "bg-muted", className)}
      {...props}
    >
      <form onSubmit={handleSubmit} className="flex flex-col justify-center gap-10 px-10 md:px-20 bg-background">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl font-bold">Bienvenue chez Triumph Motorcycle</h1>
            <p className="text-xl text-muted-foreground">Connectez-vous à votre compte</p>
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <div className="grid gap-4">
            <Label htmlFor="email" className="text-lg font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              className="h-14 text-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="grid gap-4">
            <Label htmlFor="password" className="text-lg font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              required
              className="h-14 text-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full text-xl py-6" disabled={loading}>
            {loading ? "Connexion..." : "Login"}
          </Button>
        </div>
      </form>

      <div className="relative hidden md:block">
        <Image src="/images/login_triumph.png" alt="Login Illustration" fill className="object-cover dark:brightness-[0.8]" />
      </div>
    </div>
  );
}
