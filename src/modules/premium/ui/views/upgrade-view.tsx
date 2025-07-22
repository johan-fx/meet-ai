"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { PricingCard } from "../components/pricing-card";

export const UpgradeView = () => {
	const trpc = useTRPC();

	const { data: currentSubscription } = useSuspenseQuery(
		trpc.premium.getCurrentSubscription.queryOptions(),
	);
	const { data: products } = useSuspenseQuery(
		trpc.premium.getProducts.queryOptions(),
	);

	return (
		<div className="flex flex-col flex-1 py-4 px-4 md:px-8 gap-y-10">
			<div className="flex flex-col flex-1 items-center gap-y-10">
				<h5 className="font-medium text-2xl md:text-3xl">
					You are on the{" "}
					<span className="font-semibold text-primary">
						{currentSubscription?.name ?? "Free"}
					</span>{" "}
					plan
				</h5>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{products?.map((product) => {
						const isCurrentProduct = product.id === currentSubscription?.id;
						const isPremium = !!currentSubscription;

						let buttonText = "Upgrade";
						let onClick = () => authClient.checkout({ products: [product.id] });

						if (isCurrentProduct) {
							buttonText = "Manage";
							onClick = () => authClient.customer.portal();
						} else if (isPremium) {
							buttonText = "Change Plan";
							onClick = () => authClient.customer.portal();
						}

						return (
							<PricingCard
								key={product.id}
								variant={
									product.metadata.variant === "highlighted"
										? "highlighted"
										: "default"
								}
								title={product.name}
								price={
									product.prices[0].amountType === "fixed"
										? product.prices[0].priceAmount / 100
										: 0
								}
								priceSuffix={`/${product.prices[0].recurringInterval}`}
								features={product.benefits.map(
									(benefit) => benefit.description,
								)}
								description={product.description}
								buttonText={buttonText}
								onClick={onClick}
								badge={product.metadata.badge as string | null}
							/>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export const UpgradeViewLoading = () => {
	return <div>UpgradeViewLoading</div>;
};

export const UpgradeViewError = () => {
	return <div>UpgradeViewError</div>;
};
