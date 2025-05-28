"use client";

import { Button } from "@/components/ui/button";
import { useLocalizedHref } from "@/hooks/use-localized-href";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export const HomeView = () => {
  const { data: session } = authClient.useSession();
  const { getLocalizedHref } = useLocalizedHref();
  const router = useRouter();

  const handleSignOut = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push(getLocalizedHref("/auth/sign-in"));
        },
      },
    });
  };

  return (
    <div className="p-4 flex flex-col gap-y-4">
      <div>
        Logged in as <strong>{session?.user?.name}</strong>
      </div>
      <Button onClick={handleSignOut}>Sign out</Button>
    </div>
  );
};
