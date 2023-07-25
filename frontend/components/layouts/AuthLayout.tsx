import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

type Props = {
  children?: ReactNode;
};

export default function AuthLayout({ children }: Props) {
  const router = useRouter();
  const { status } = useSession();

  const [stayOnPage, setStayOnPage] = useState(false);

  useEffect(() => {
    // Needed to prevent page flash before redirect
    if (status === "loading" || !router.isReady) return;

    if (router.pathname === "/") {
      router.push({
        pathname: status === "unauthenticated" ? "/login" : "/app/search",
      });
    } 
    else if (status === "unauthenticated" && router.pathname !== "/login" && router.pathname !== "/announcements") {
      router.push({
        pathname: "/login",
      });
    } 
    else if (status === "authenticated" && router.pathname === "/login") {
      router.push({
        pathname: "/app/profile",
      });
    }
    else setStayOnPage(true);
  }, [status, router]);

  return <>{stayOnPage && children}</>;
}
