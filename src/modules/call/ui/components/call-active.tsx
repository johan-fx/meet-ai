import { CallControls, SpeakerLayout } from "@stream-io/video-react-sdk";
import Link from "next/link";
import Logo from "@/components/ui/logo";

interface Props {
	onLeave: () => void;
	meetingName: string;
}

export const CallActive = ({ onLeave, meetingName }: Props) => {
	return (
		<div className="flex flex-col justify-between h-full p-4 text-white">
			<div className="flex items-center gap-4 bg-neutral-900 rounded-full p-4">
				<Link
					href="/"
					className="flex items-center justify-center p-1 bg-white/10 rounded-full w-fit"
				>
					<Logo className="w-[22px] h-[22px]" />
				</Link>
				<h4 className="text-base">{meetingName}</h4>
			</div>
			<SpeakerLayout />
			<div className="bg-neutral-900 rounded-full px-4">
				<CallControls onLeave={onLeave} />
			</div>
		</div>
	);
};
