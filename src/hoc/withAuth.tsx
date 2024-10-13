import Loading from "@/components/Loading";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function WithAuth(Component: React.ComponentType) {
  return function AuthenticatedComponent(props: any) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push("/signin");
      }
    }, [user, loading]);

    if (loading) {
      return <Loading />;
    }

    return user ? <Component {...props} /> : null;
  };
}
