import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function withAuth(Component: React.ComponentType) {
  return function AuthenticatedComponent(props: any) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push("/signin");
      }
    }, [user, loading]);

    if (loading) {
      return <div>Loading...</div>;
    }

    return user ? <Component {...props} /> : null;
  };
}
