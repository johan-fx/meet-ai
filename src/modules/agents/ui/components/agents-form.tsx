import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/client";
import { newAgentSchema } from "../../schemas";
import type { AgentGetOne } from "../../types";

interface AgentsFormProps {
	onSuccess?: () => void;
	onCancel?: () => void;
	initialValues?: AgentGetOne;
}

const AgentsForm = ({
	onSuccess,
	onCancel,
	initialValues,
}: AgentsFormProps) => {
	const t = useTranslations("agents.form");
	const trpc = useTRPC();
	const router = useRouter();
	const queryClient = useQueryClient();

	const createAgent = useMutation(
		trpc.agents.create.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries(
					trpc.agents.getMany.queryOptions({}),
				);

				if (initialValues?.id) {
					await queryClient.invalidateQueries(
						trpc.agents.getOne.queryOptions({ id: initialValues.id }),
					);
				}

				onSuccess?.();
			},
			onError: (error) => {
				toast.error(error.message);

				if (error.data?.code === "FORBIDDEN") {
					router.push("/upgrade");
				}
			},
		}),
	);

	const form = useForm<z.infer<typeof newAgentSchema>>({
		resolver: zodResolver(newAgentSchema),
		defaultValues: {
			name: initialValues?.name ?? "",
			instructions: initialValues?.instructions ?? "",
		},
	});

	const isEdit = !!initialValues;
	const isPending = createAgent.isPending;

	const onSubmit = (values: z.infer<typeof newAgentSchema>) => {
		if (isEdit) {
			// TODO: Implement edit agent
		} else {
			createAgent.mutate(values);
		}
	};

	return (
		<Form {...form}>
			<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
				<GeneratedAvatar
					seed={form.watch("name")}
					variant="botttsNeutral"
					className="border size-16"
				/>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("name")}</FormLabel>
							<FormControl>
								<Input {...field} placeholder={t("namePlaceholder")} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="instructions"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("instructions")}</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									placeholder={t("instructionsPlaceholder")}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex justify-end gap-4 mt-6">
					{!!onCancel && (
						<Button
							type="button"
							variant="outline"
							onClick={onCancel}
							disabled={isPending}
							className="flex-1 md:flex-none"
						>
							{t("cancel")}
						</Button>
					)}
					<Button
						type="submit"
						disabled={isPending}
						className="flex-1 md:flex-none"
					>
						{isPending && <Loader2 className="size-4 animate-spin" />}
						{isEdit ? t("save") : t("create")}
					</Button>
				</div>
			</form>
		</Form>
	);
};

export { AgentsForm };
