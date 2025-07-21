import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import { useFormatter } from "next-intl";
import { useState } from "react";
import Highlighter from "react-highlight-words";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/trpc/client";

interface Props {
	meetingId: string;
}

export const Transcript = ({ meetingId }: Props) => {
	const trpc = useTRPC();
	const format = useFormatter();
	const [searchQuery, setSearchQuery] = useState("");

	const { data: transcript, isLoading } = useQuery(
		trpc.meetings.getTranscript.queryOptions({
			id: meetingId,
		}),
	);

	const filteredTranscript =
		transcript?.filter((item) =>
			item.text.toLowerCase().includes(searchQuery.toLowerCase()),
		) ?? [];

	return (
		<div className="flex flex-col gap-y-4 w-full">
			<p className="text-sm font-semibold">Transcript</p>
			<div className="relative">
				<Input
					placeholder="Search transcript"
					className="pl-7 h-9 w-[240px]"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
				<SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
			</div>
			<ScrollArea>
				{isLoading ? (
					<TranscriptLoading />
				) : (
					<div className="flex flex-col gap-y-4">
						{filteredTranscript.map((item) => (
							<div
								key={item.start_ts}
								className="flex flex-col gap-y-2 hover:bg-muted p-4 rounded-md border"
							>
								<div className="flex gap-x-2 items-center">
									<Avatar className="size-6">
										<AvatarImage src={item.user.image} alt={item.user.name} />
									</Avatar>
									<p className="text-sm font-semibold">{item.user.name}</p>
									<p className="text-sm text-blue-500">
										{format.dateTime(new Date(item.start_ts), {
											minute: "2-digit",
											second: "2-digit",
										})}
									</p>
								</div>
								<Highlighter
									className="text-sm text-neutral-700"
									searchWords={[searchQuery]}
									textToHighlight={item.text}
									highlightClassName="bg-yellow-200"
									autoEscape={true}
								/>
							</div>
						))}
					</div>
				)}
			</ScrollArea>
		</div>
	);
};

const TranscriptLoading = () => {
	return (
		<div className="flex flex-col gap-y-4">
			<Skeleton className="h-5 w-[200px]" />
			<Skeleton className="h-5 w-[400px]" />
		</div>
	);
};
