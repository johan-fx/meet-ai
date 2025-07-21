import {
	BookOpenTextIcon,
	ClockFadingIcon,
	FileTextIcon,
	FileVideoIcon,
	SparklesIcon,
} from "lucide-react";
import Link from "next/link";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import Markdown from "react-markdown";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDuration } from "@/lib/utils";
import type { MeetingGetOne } from "@/modules/meetings/types";
import { ChatProvider } from "../chat-provider";
import { ChatUI } from "../chat-ui";
import { Transcript } from "../transcript";

const tabTriggerClasses =
	"h-full text-muted-foreground rounded-none bg-background border-b-2 border-transparent data-[state=active]:shadow-none data-[state=active]:text-accent-foreground data-[state=active]:border-b-primary hover:text-accent-foreground";

enum MeetingTabs {
	SUMMARY = "summary",
	TRANSCRIPT = "transcript",
	RECORDING = "recording",
	CHAT = "chat",
}

interface Props {
	meeting: MeetingGetOne;
}

export const CompletedState = ({ meeting }: Props) => {
	const t = useTranslations("meetings.detail");
	const tList = useTranslations("meetings.list");
	const format = useFormatter();
	const locale = useLocale();

	return (
		<div className="flex flex-col gap-y-4">
			<Tabs defaultValue="summary">
				<div className="bg-white rounded-lg border px-3">
					<ScrollArea>
						<TabsList className="p-0 bg-background justify-start rounded-none h-13">
							<TabsTrigger
								value={MeetingTabs.SUMMARY}
								className={tabTriggerClasses}
							>
								<BookOpenTextIcon />
								{t("completed.tabs.summary")}
							</TabsTrigger>
							<TabsTrigger
								value={MeetingTabs.TRANSCRIPT}
								className={tabTriggerClasses}
							>
								<FileTextIcon />
								{t("completed.tabs.transcript")}
							</TabsTrigger>
							<TabsTrigger
								value={MeetingTabs.RECORDING}
								className={tabTriggerClasses}
							>
								<FileVideoIcon />
								{t("completed.tabs.recording")}
							</TabsTrigger>
							<TabsTrigger
								value={MeetingTabs.CHAT}
								className={tabTriggerClasses}
							>
								<SparklesIcon />
								{t("completed.tabs.chat")}
							</TabsTrigger>
						</TabsList>
						<ScrollBar orientation="horizontal" />
					</ScrollArea>
				</div>
				<TabsContent value={MeetingTabs.SUMMARY}>
					<div className="bg-white rounded-lg border">
						<div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
							<h2 className="text-2xl font-medium capitalize">
								{meeting.name}
							</h2>
							<div className="flex items-center gap-x-2">
								<Link
									href={`/agents/${meeting.agent.id}`}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={`View agent ${meeting.agent.name} details`}
									className="flex items-center gap-x-2 underline underline-offset-4 capitalize"
								>
									<GeneratedAvatar
										variant="botttsNeutral"
										seed={meeting.agent.name}
										className="size-5"
									/>
									{meeting.agent.name}
								</Link>
								<p>
									{meeting.startedAt
										? format.dateTime(new Date(meeting.startedAt), {
												dateStyle: "medium",
											})
										: "N/A"}
								</p>
							</div>
							<div className="flex items-center gap-x-2">
								<SparklesIcon className="size-4" />
								<p>{t("completed.generalSummary")}</p>
							</div>
							<Badge
								variant="outline"
								className="flex items-center gap-x-2 capitalize [&>svg]:size-4"
							>
								<ClockFadingIcon />
								{meeting.duration > 0
									? formatDuration(meeting.duration, locale)
									: tList("durationUnknown")}
							</Badge>
							<div>
								<Markdown
									skipHtml={true}
									disallowedElements={["script", "iframe", "object", "embed"]}
									components={{
										h1: (props) => (
											<h1 className="text-2xl font-semibold mb-6" {...props} />
										),
										h2: (props) => (
											<h2 className="text-xl font-semibold mb-4" {...props} />
										),
										h3: (props) => (
											<h3 className="text-lg font-semibold mb-3" {...props} />
										),
										h4: (props) => (
											<h4 className="text-base font-semibold mb-2" {...props} />
										),
										ul: (props) => (
											<ul
												className="list-disc list-inside pl-3 mb-4"
												{...props}
											/>
										),
										ol: (props) => (
											<ol
												className="list-decimal list-inside mb-4"
												{...props}
											/>
										),
										li: (props) => <li className="mb-1" {...props} />,
										p: (props) => (
											<p className="leading-relaxed mb-6" {...props} />
										),
										strong: (props) => (
											<strong className="font-semibold" {...props} />
										),
										code: (props) => (
											<code className="bg-muted p-1 rounded-md" {...props} />
										),
										pre: (props) => (
											<pre className="bg-muted p-4 rounded-md" {...props} />
										),
										blockquote: (props) => (
											<blockquote
												className="border-l-4 border-primary italic pl-4 my-4"
												{...props}
											/>
										),
									}}
								>
									{meeting.summary}
								</Markdown>
							</div>
						</div>
					</div>
				</TabsContent>
				<TabsContent value={MeetingTabs.TRANSCRIPT}>
					<div className="bg-white rounded-lg border px-4 py-5">
						<Transcript meetingId={meeting.id} />
					</div>
				</TabsContent>
				<TabsContent value={MeetingTabs.RECORDING}>
					<div className="bg-white rounded-lg border px-4 py-5">
						<video
							src={meeting.recordingUrl ?? ""}
							controls
							className="w-full rounded-lg"
						>
							<track kind="captions" />
						</video>
					</div>
				</TabsContent>
				<TabsContent value={MeetingTabs.CHAT}>
					<div className="bg-white rounded-lg border overflow-hidden">
						<ChatProvider meetingId={meeting.id} />
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
};
