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
import { useLocalizedHref } from "@/hooks/use-localized-href";
import { authClient } from "@/lib/auth-client";
import type { Dictionary } from "@/types/dictionary";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, OctagonAlertIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const SignInView = ({ dictionary }: { dictionary: Dictionary }) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { getLocalizedHref } = useLocalizedHref();

  // Create form schema with dictionary values for validation messages
  const formSchema = z.object({
    email: z.string().email({ message: dictionary.auth.signIn.emailRequired }),
    password: z
      .string()
      .min(1, { message: dictionary.auth.signIn.passwordRequired }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setError(null);
    setIsLoading(true);

    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      callbackURL: getLocalizedHref("/"),
    });

    if (error) {
      setError(error.message ?? dictionary.auth.signIn.defaultError);
      setIsLoading(false);
    }
  };

  const onSocial = async (provider: "google" | "github") => {
    setError(null);
    setIsLoading(true);

    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: getLocalizedHref("/"),
    });

    if (error) {
      setError(error.message ?? dictionary.auth.signIn.defaultError);
      setIsLoading(false);
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
                    {dictionary.auth.signIn.title}
                  </h1>
                  <p className="text-sm">
                    {dictionary.auth.signIn.description}
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary.auth.signIn.email}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder={dictionary.auth.signIn.emailPlaceholder}
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
                      <FormLabel>{dictionary.auth.signIn.password}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder={
                            dictionary.auth.signIn.passwordPlaceholder
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
                    <AlertTitle>{dictionary.auth.signIn.errorTitle}</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {dictionary.auth.signIn.signIn}
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                </Button>

                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <hr className="border-t" />
                  <span className="text-muted-foreground text-xs">
                    {dictionary.auth.signIn.orContinueWith}
                  </span>
                  <hr className="border-t" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isLoading}
                    onClick={() => onSocial("google")}
                  >
                    <GoogleIcon />
                    <span>{dictionary.auth.signIn.google}</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isLoading}
                    onClick={() => onSocial("github")}
                  >
                    <GithubIcon />
                    <span>{dictionary.auth.signIn.github}</span>
                  </Button>
                </div>
              </div>

              <div className="p-3">
                <p className="text-accent-foreground text-center text-sm">
                  {dictionary.auth.signIn.noAccount}
                  <Button asChild variant="link" className="px-2">
                    <Link href={getLocalizedHref("/auth/sign-up")}>
                      {dictionary.auth.signIn.createAccount}
                    </Link>
                  </Button>
                </p>
              </div>
            </form>
          </Form>
          <div className="bg-primary relative hidden md:flex flex-col gap-y-4 justify-center items-center">
            <Logo className="w-[92px] h-[92px]" />
            <p className="text-white text-2xl font-bold">
              {dictionary.auth.signIn.appName}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground text-balance space-x-1 *:[a]:hover:text-primary *:[a]:underline *:[a]:underline-offset-4">
        <span>{dictionary.auth.signIn.termsText}</span>
        <Link href={getLocalizedHref("/terms")}>
          {dictionary.auth.signIn.termsOfService}
        </Link>
        <span>{dictionary.auth.signIn.and}</span>
        <Link href={getLocalizedHref("/privacy")}>
          {dictionary.auth.signIn.privacyPolicy}
        </Link>
      </div>
    </div>
  );
};
