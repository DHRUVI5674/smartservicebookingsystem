import { Navigate } from 'react-router-dom';
import { useGlobal } from '../context/GlobalContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useGlobal();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
