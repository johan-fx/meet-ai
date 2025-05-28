"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import GithubIcon from "@/components/ui/github-icon";
import GoogleIcon from "@/components/ui/google-icon";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, OctagonAlertIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const SignUpView = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setError(null);
    setIsLoading(true);

    const { error } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (error) {
      setError(error.message ?? "An error occurred");
      setIsLoading(false);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6 p-6 md:p-8">
                <div className="text-center">
                  <h1 className="text-2xl font-semibold">
                    Let&apos;s get started
                  </h1>
                  <p className="text-sm">Create your account</p>
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter your name"
                        />
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
                        <Input
                          {...field}
                          type="email"
                          placeholder="Enter your email"
                        />
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
                        <Input
                          {...field}
                          type="password"
                          placeholder="Enter your password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Confirm your password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!!error && (
                  <Alert className="bg-destructive/10 border-none">
                    <OctagonAlertIcon className="h-4 w-4 !text-destructive" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  Sign Up
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                </Button>

                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <hr className="border-t" />
                  <span className="text-muted-foreground text-xs">
                    Or continue with
                  </span>
                  <hr className="border-t" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button type="button" variant="outline" disabled={isLoading}>
                    <GoogleIcon />
                    <span>Google</span>
                  </Button>
                  <Button type="button" variant="outline" disabled={isLoading}>
                    <GithubIcon />
                    <span>GitHub</span>
                  </Button>
                </div>
              </div>

              <div className="p-3">
                <p className="text-accent-foreground text-center text-sm">
                  Already have an account ?
                  <Button asChild variant="link" className="px-2">
                    <Link href="/auth/sign-in">Sign In</Link>
                  </Button>
                </p>
              </div>
            </form>
          </Form>
          <div className="bg-linear-to-b from-primary to-primary/80 relative hidden md:flex flex-col gap-y-4 justify-center items-center">
            <img src="/logo.svg" alt="Meet.AI" className="w-[92px] h-[92px]" />
            <p className="text-white text-2xl font-bold">Meet.AI</p>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground text-balance *:[a]:hover:text-primary *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our{" "}
        <Link href="/terms">Terms of Service</Link> and{" "}
        <Link href="/privacy">Privacy Policy</Link>
      </div>
    </div>
  );
};
