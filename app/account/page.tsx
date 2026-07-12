import type { Metadata } from "next";
import Link from "next/link";

import { SiteHeader } from "@/components/SiteHeader";
import { AuthForm } from "@/components/auth/AuthForm";
import { DeleteAccountButton } from "@/components/auth/DeleteAccountButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { strings } from "@/lib/strings";

import { signOut } from "./actions";

export const metadata: Metadata = { title: strings.common.account };

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isPermanent = !!user && !user.is_anonymous;

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-8">
        {isPermanent ? (
          <div className="space-y-6">
            <div className="space-y-1 text-center">
              <h1 className="text-2xl font-bold tracking-tight">{strings.account.accountTitle}</h1>
              <p className="text-muted-foreground text-sm">
                {strings.account.signedInAs}{" "}
                <span className="text-foreground font-medium">{user.email}</span>
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button asChild className="h-11">
                <Link href="/history">{strings.account.viewHistory}</Link>
              </Button>
              <form action={signOut}>
                <Button type="submit" variant="outline" className="h-11 w-full">
                  {strings.account.signOut}
                </Button>
              </form>
            </div>

            {/* Danger zone — ลบบัญชีถาวร (PDPA §7.8) */}
            <Card className="ring-destructive/30">
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <h2 className="text-destructive text-sm font-semibold">
                    {strings.account.dangerTitle}
                  </h2>
                  <p className="text-muted-foreground text-sm">{strings.account.dangerDesc}</p>
                </div>
                <DeleteAccountButton />
              </CardContent>
            </Card>
          </div>
        ) : (
          <AuthForm isAnonymous={!!user?.is_anonymous} />
        )}
      </main>
    </div>
  );
}
