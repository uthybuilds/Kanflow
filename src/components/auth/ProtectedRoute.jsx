import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ session, children }) => {
  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  if (session?.user?.user_metadata?.deleted) {
    return <Navigate to="/" replace />;
  }

  return children;
};
