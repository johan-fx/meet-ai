import { LoaderIcon } from "lucide-react";

export const CallLoader = () => {
	return (
        <div className="flex h-screen items-center justify-center bg-primary">
            <LoaderIcon className="animate-spin size-6 text-white" />
        </div>
    )
};