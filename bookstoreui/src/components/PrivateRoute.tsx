import React from 'react';
import { Navigate, Outlet, RouteProps } from 'react-router-dom';
import { useAuthContext } from '../context/auth';
import { RoutePaths } from '../utils/enum';

const PrivateRoute = ({ children }: RouteProps) => {
	const authContext = useAuthContext();
	if (!authContext.user.id) {
		return <Navigate to={RoutePaths.Login} replace />;
	}

	return <Outlet />;
};

export default PrivateRoute;
