"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "grid h-screen w-full md:grid-cols-2",
        "bg-muted",
        className
      )}
      {...props}
    >
      {/* Form Section */}
      <form className="flex flex-col justify-center gap-10 px-10 md:px-20 bg-background">
        <div className="flex flex-col gap-10">
          {/* Header Section */}
          <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl font-bold">Bienvenue chez Triumph Motorcycle</h1>
            <p className="text-xl text-muted-foreground">
              Connectez-vous à votre compte
            </p>
          </div>

          {/* Email Field */}
          <div className="grid gap-4">
            <Label
              htmlFor="email"
              className="text-lg font-medium"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              className="h-14 text-lg"
            />
          </div>

          {/* Password Field */}
          <div className="grid gap-4">
            <Label
              htmlFor="password"
              className="text-lg font-medium"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              required
              className="h-14 text-lg"
            />
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            className="w-full text-xl py-6"
          >
            Login
          </Button>
        </div>
      </form>

      {/* Image Section */}
      <div className="relative hidden md:block">
        <Image
          src="/images/login_triumph.png"
          alt="Login Illustration"
          fill
          className="object-cover dark:brightness-[0.8]"
        />
      </div>
    </div>
  );
}
