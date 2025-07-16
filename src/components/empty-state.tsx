import Image from "next/image";

interface EmptyStateProps {
	title: string;
	description: string;
	image: string;
}

const EmptyState = ({ title, description, image }: EmptyStateProps) => {
	return (
		<div className="flex flex-col items-center justify-center py-8">
			<div className="flex flex-col gap-y-4 max-w-md mx-auto text-center">
				<Image
					src={image}
					alt={title}
					width={240}
					height={240}
					className="mx-auto"
				/>
				<div className="flex flex-col gap-y-4">
					<h6 className="text-lg font-semibold">{title}</h6>
					<p className="text-sm whitespace-normal">{description}</p>
				</div>
			</div>
		</div>
	);
};

export { EmptyState };
