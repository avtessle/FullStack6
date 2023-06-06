import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  if (localStorage.length === 0) {
    return <Navigate to="/login" />;
  }
  return children;
}
export default ProtectedRoute;
