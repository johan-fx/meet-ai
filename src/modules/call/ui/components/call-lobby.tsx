import {
	DefaultVideoPlaceholder,
	type StreamVideoParticipant,
	ToggleAudioPreviewButton,
	ToggleVideoPreviewButton,
	useCallStateHooks,
	VideoPreview,
} from "@stream-io/video-react-sdk";
import { LogInIcon } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { generateAvatarUri } from "@/lib/avatar";

const DisabledVideoPreview = () => {
	const { data } = authClient.useSession();

	return (
		<DefaultVideoPlaceholder
			participant={
				{
					name: data?.user?.name ?? "",
					image:
						data?.user?.image ??
						generateAvatarUri({
							seed: data?.user?.name ?? "",
							variant: "initials",
						}),
				} as StreamVideoParticipant
			}
		/>
	);
};

const AllowBrowserPermissions = () => {
	const t = useTranslations("call.lobby");

	return <p className="text-sm">{t("allowBrowserPermissions")}</p>;
};

interface Props {
	onJoin: () => void;
	meetingName: string;
}

export const CallLobby = ({ onJoin, meetingName }: Props) => {
	const t = useTranslations("call.lobby");
	const tGlobal = useTranslations("global.form");

	const { useCameraState, useMicrophoneState } = useCallStateHooks();

	const { hasBrowserPermission: hasMicPermission } = useMicrophoneState();
	const { hasBrowserPermission: hasCameraPermission } = useCameraState();

	const hasBrowserPermissions = hasMicPermission && hasCameraPermission;

	return (
		<div className="flex flex-col h-full items-center justify-center bg-primary">
			<div className="flex flex-1 items-center justify-center py-4 px-8">
				<div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-6 shadow-sm">
					<div className="flex flex-col gap-y-2 text-center">
						<h6 className="text-lg font-semibold">
							{t("title", { meetingName })}
						</h6>
						<p className="text-sm">{t("description")}</p>
					</div>
					<VideoPreview
						DisabledVideoPreview={
							hasBrowserPermissions
								? DisabledVideoPreview
								: AllowBrowserPermissions
						}
					/>
					<div className="flex gap-x-2">
						<ToggleAudioPreviewButton />
						<ToggleVideoPreviewButton />
					</div>
					<div className="flex w-full justify-between">
						<Button asChild variant="ghost">
							<Link href="/meetings">{tGlobal("cancel")}</Link>
						</Button>
						<Button onClick={onJoin}>
							<LogInIcon />
							{t("join")}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};
