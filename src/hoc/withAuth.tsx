import Loading from "@/components/Loading";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function WithAuth<ComponentProps extends object>(
  Component: React.ComponentType<ComponentProps & JSX.IntrinsicAttributes>
) {
  return function AuthenticatedComponent(props: ComponentProps) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        const currentPath = window.location.pathname;
        router.push(`/signin?redirect=${encodeURIComponent(currentPath)}`);
      }
    }, [user, loading]);

    if (loading) {
      return <Loading />;
    }

    return user ? <Component {...props} /> : null;
  };
}
