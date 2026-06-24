import { Navigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

interface Props {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly }: Props) {
  const user = useStore((state) => state.user);
  const isAdmin = useStore((state) => state.isAdmin());

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;

  return <>{children}</>;
}
