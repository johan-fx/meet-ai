"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, OctagonAlertIcon } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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

export const SignInView = () => {
	const t = useTranslations("auth.signIn");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const { getLocalizedHref } = useLocalizedHref();

	// Create form schema with i18n values for validation messages
	const formSchema = z.object({
		email: z.string().email({ message: t("emailRequired") }),
		password: z.string().min(1, { message: t("passwordRequired") }),
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
			setError(error.message ?? t("defaultError"));
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
			setError(error.message ?? t("defaultError"));
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
									<h1 className="text-2xl font-semibold">{t("title")}</h1>
									<p className="text-sm">{t("description")}</p>
								</div>

								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t("email")}</FormLabel>
											<FormControl>
												<Input
													{...field}
													type="email"
													placeholder={t("emailPlaceholder")}
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
											<FormLabel>{t("password")}</FormLabel>
											<FormControl>
												<Input
													{...field}
													type="password"
													placeholder={t("passwordPlaceholder")}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{!!error && (
									<Alert className="bg-destructive/10 border-none">
										<OctagonAlertIcon className="h-4 w-4 !text-destructive" />
										<AlertTitle>{t("errorTitle")}</AlertTitle>
										<AlertDescription>{error}</AlertDescription>
									</Alert>
								)}

								<Button type="submit" className="w-full" disabled={isLoading}>
									{t("signIn")}
									{isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
								</Button>

								<div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
									<hr className="border-t" />
									<span className="text-muted-foreground text-xs">
										{t("orContinueWith")}
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
										<span>{t("google")}</span>
									</Button>
									<Button
										type="button"
										variant="outline"
										disabled={isLoading}
										onClick={() => onSocial("github")}
									>
										<GithubIcon />
										<span>{t("github")}</span>
									</Button>
								</div>
							</div>

							<div className="p-3">
								<p className="text-accent-foreground text-center text-sm">
									{t("noAccount")}
									<Button asChild variant="link" className="px-2">
										<Link href={getLocalizedHref("/auth/sign-up")}>
											{t("createAccount")}
										</Link>
									</Button>
								</p>
							</div>
						</form>
					</Form>
					<div className="bg-primary relative hidden md:flex flex-col gap-y-4 justify-center items-center">
						<Logo className="w-[92px] h-[92px]" />
						<p className="text-white text-2xl font-bold">{t("appName")}</p>
					</div>
				</CardContent>
			</Card>

			<div className="text-center text-sm text-muted-foreground text-balance space-x-1 *:[a]:hover:text-primary *:[a]:underline *:[a]:underline-offset-4">
				<span>{t("termsText")}</span>
				<Link href={getLocalizedHref("/terms")}>{t("termsOfService")}</Link>
				<span>{t("and")}</span>
				<Link href={getLocalizedHref("/privacy")}>{t("privacyPolicy")}</Link>
			</div>
		</div>
	);
};
