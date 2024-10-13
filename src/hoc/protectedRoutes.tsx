import Loading from "@/components/Loading";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { user, loading, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        const currentPath = window.location.pathname;
        router.push(`/signin?redirect=${encodeURIComponent(currentPath)}`);
      } else if (requiredRole && role !== requiredRole) {
        router.push("/unauthorized");
      }
    }
  }, [user, loading, role, requiredRole, router]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>{user && (!requiredRole || role === requiredRole) ? children : null}</>
  );
};

export default ProtectedRoute;
