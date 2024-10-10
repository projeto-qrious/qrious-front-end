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
        router.push("/signin");
      } else if (requiredRole && role !== requiredRole) {
        router.push("/unauthorized"); // A page to show unauthorized access
      }
    }
  }, [user, loading, role]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>{user && (!requiredRole || role === requiredRole) ? children : null}</>
  );
};

export default ProtectedRoute;
