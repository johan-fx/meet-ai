import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";
import { useTRPC } from "@/trpc/client";
import { newMeetingSchema } from "../../schemas";
import type { MeetingGetOne } from "../../types";

interface MeetingsFormProps {
	onSuccess?: (id?: string) => void;
	onCancel?: () => void;
	initialValues?: MeetingGetOne;
}

const MeetingsForm = ({
	onSuccess,
	onCancel,
	initialValues,
}: MeetingsFormProps) => {
	const t = useTranslations("meetings.form");
	const tForm = useTranslations("global.form");
	const trpc = useTRPC();
	const router = useRouter();
	const queryClient = useQueryClient();

	const [agentSearch, setAgentSearch] = useState<string | undefined>(undefined);
	const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false);

	const agents = useQuery(
		trpc.agents.getMany.queryOptions({
			pageSize: 100,
			search: agentSearch,
		}),
	);

	const createMeeting = useMutation(
		trpc.meetings.create.mutationOptions({
			onSuccess: async (data) => {
				await queryClient.invalidateQueries(
					trpc.meetings.getMany.queryOptions({}),
				);

				// TODO: Invalidate free tier usage

				onSuccess?.(data.id);
			},
			onError: (error) => {
				toast.error(error.message);

				if (error.data?.code === "FORBIDDEN") {
					router.push("/upgrade");
				}
			},
		}),
	);

	const updateMeeting = useMutation(
		trpc.meetings.update.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries(
					trpc.meetings.getMany.queryOptions({}),
				);

				if (initialValues?.id) {
					await queryClient.invalidateQueries(
						trpc.meetings.getOne.queryOptions({ id: initialValues.id }),
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

	const form = useForm<z.infer<typeof newMeetingSchema>>({
		resolver: zodResolver(newMeetingSchema),
		defaultValues: {
			name: initialValues?.name ?? "",
			agentId: initialValues?.agentId ?? "",
			status: initialValues?.status ?? "upcoming",
		},
	});

	const isEdit = !!initialValues?.id;
	const isPending = createMeeting.isPending || updateMeeting.isPending;

	const onSubmit = (values: z.infer<typeof newMeetingSchema>) => {
		if (isEdit) {
			updateMeeting.mutate({
				...values,
				id: initialValues.id,
			});
		} else {
			createMeeting.mutate(values);
		}
	};

	return (
		<>
			<NewAgentDialog
				open={openNewAgentDialog}
				onOpenChange={setOpenNewAgentDialog}
			/>
			<Form {...form}>
				<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
						name="agentId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t("agent")}</FormLabel>
								<FormControl>
									<CommandSelect
										value={field.value}
										onSelect={field.onChange}
										onSearch={setAgentSearch}
										options={(agents.data?.items ?? []).map((agent) => ({
											id: agent.id,
											value: agent.id,
											children: (
												<div className="flex items-center gap-x-2">
													<GeneratedAvatar
														seed={agent.name}
														variant="botttsNeutral"
														className="size-6 border"
													/>
													<span>{agent.name}</span>
												</div>
											),
										}))}
										placeholder={t("agentPlaceholder")}
									/>
								</FormControl>
								<FormDescription>
									<span>{t("agentDescription")}</span>
									<Button
										type="button"
										variant="link"
										onClick={() => setOpenNewAgentDialog(true)}
									>
										{t("createNewAgent")}
									</Button>
								</FormDescription>
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
								{tForm("cancel")}
							</Button>
						)}
						<Button
							type="submit"
							disabled={isPending}
							className="flex-1 md:flex-none"
						>
							{isPending && <Loader2 className="size-4 animate-spin" />}
							{isEdit ? t("update") : t("create")}
						</Button>
					</div>
				</form>
			</Form>
		</>
	);
};

export { MeetingsForm };
