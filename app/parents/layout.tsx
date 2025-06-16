import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  if (data?.user) {
    const userRole = data?.user.user_metadata.role;
    if (userRole != "parent") {
      return redirect("/dashboard");
    }
  } else {
    return redirect("/auth/login");
  }
  return <div>{children}</div>;
}
