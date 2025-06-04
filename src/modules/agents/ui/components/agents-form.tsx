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
import { ViewProps } from "@/types/view";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { newAgentSchema } from "../../schemas";
import { AgentGetOne } from "../../types";

interface AgentsFormProps extends ViewProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: AgentGetOne;
}

const AgentsForm = ({
  dictionary,
  onSuccess,
  onCancel,
  initialValues,
}: AgentsFormProps) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const createAgent = useMutation(
    trpc.agents.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions());

        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.agents.getOne.queryOptions({ id: initialValues.id })
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
    })
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
              <FormLabel>{dictionary.agents.form.name}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={dictionary.agents.form.namePlaceholder}
                />
              </FormControl>
              <FormMessage dictionary={dictionary} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.agents.form.instructions}</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder={dictionary.agents.form.instructionsPlaceholder}
                />
              </FormControl>
              <FormMessage dictionary={dictionary} />
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
              {dictionary.agents.form.cancel}
            </Button>
          )}
          <Button
            type="submit"
            disabled={isPending}
            className="flex-1 md:flex-none"
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            {isEdit
              ? dictionary.agents.form.save
              : dictionary.agents.form.create}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export { AgentsForm };
