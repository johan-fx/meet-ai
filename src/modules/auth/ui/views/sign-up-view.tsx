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
import Logo from "@/components/ui/logo";
import { authClient } from "@/lib/auth-client";
import type { Dictionary } from "@/types/dictionary";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, OctagonAlertIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const SignUpView = ({ dictionary }: { dictionary: Dictionary }) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Create form schema with dictionary values for validation messages
  const formSchema = z
    .object({
      name: z.string().min(1, { message: dictionary.auth.signUp.nameRequired }),
      email: z
        .string()
        .email({ message: dictionary.auth.signUp.emailRequired }),
      password: z
        .string()
        .min(1, { message: dictionary.auth.signUp.passwordRequired }),
      confirmPassword: z
        .string()
        .min(1, { message: dictionary.auth.signUp.confirmPasswordRequired }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: dictionary.auth.signUp.passwordsDoNotMatch,
    });

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
      setError(error.message ?? dictionary.auth.signUp.defaultError);
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
                    {dictionary.auth.signUp.title}
                  </h1>
                  <p className="text-sm">
                    {dictionary.auth.signUp.description}
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary.auth.signUp.name}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder={dictionary.auth.signUp.namePlaceholder}
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
                      <FormLabel>{dictionary.auth.signUp.email}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder={dictionary.auth.signUp.emailPlaceholder}
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
                      <FormLabel>{dictionary.auth.signUp.password}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder={
                            dictionary.auth.signUp.passwordPlaceholder
                          }
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
                      <FormLabel>
                        {dictionary.auth.signUp.confirmPassword}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder={
                            dictionary.auth.signUp.confirmPasswordPlaceholder
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!!error && (
                  <Alert className="bg-destructive/10 border-none">
                    <OctagonAlertIcon className="h-4 w-4 !text-destructive" />
                    <AlertTitle>{dictionary.auth.signUp.errorTitle}</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {dictionary.auth.signUp.signUp}
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                </Button>

                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <hr className="border-t" />
                  <span className="text-muted-foreground text-xs">
                    {dictionary.auth.signUp.orContinueWith}
                  </span>
                  <hr className="border-t" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button type="button" variant="outline" disabled={isLoading}>
                    <GoogleIcon />
                    <span>{dictionary.auth.signUp.google}</span>
                  </Button>
                  <Button type="button" variant="outline" disabled={isLoading}>
                    <GithubIcon />
                    <span>{dictionary.auth.signUp.github}</span>
                  </Button>
                </div>
              </div>

              <div className="p-3">
                <p className="text-accent-foreground text-center text-sm">
                  {dictionary.auth.signUp.alreadyHaveAccount}
                  <Button asChild variant="link" className="px-2">
                    <Link href="/auth/sign-in">
                      {dictionary.auth.signUp.signIn}
                    </Link>
                  </Button>
                </p>
              </div>
            </form>
          </Form>
          <div className="bg-linear-to-b from-primary to-primary/80 relative hidden md:flex flex-col gap-y-4 justify-center items-center">
            <Logo className="w-[92px] h-[92px]" />
            <p className="text-white text-2xl font-bold">
              {dictionary.auth.signUp.appName}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground text-balance *:[a]:hover:text-primary *:[a]:underline *:[a]:underline-offset-4">
        {dictionary.auth.signUp.termsText}{" "}
        <Link href="/terms">{dictionary.auth.signUp.termsOfService}</Link>{" "}
        {dictionary.auth.signUp.and}{" "}
        <Link href="/privacy">{dictionary.auth.signUp.privacyPolicy}</Link>
      </div>
    </div>
  );
};
