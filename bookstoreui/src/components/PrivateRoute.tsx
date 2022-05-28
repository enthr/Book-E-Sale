import React from 'react';
import { Navigate, Route, RouteProps } from 'react-router-dom';
import { useAuthContext } from '../context/auth';
import { RoutePaths } from '../utils/enum';

const PrivateRoute = ({ element, path }: RouteProps) => {
	const authContext = useAuthContext();
	if (!authContext.user.id) {
		return <Navigate to={RoutePaths.Login} replace />;
	}

	return <Route path={path} element={element} />;
};

export default PrivateRoute;
