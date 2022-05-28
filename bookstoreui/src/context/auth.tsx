import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import Shared from '../utils/shared';
import { RoutePaths } from '../utils/enum';
import UserModel from '../models/UserModel';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

export interface AuthContextModel {
	setUser: (user: UserModel) => void;
	user: UserModel;
	signOut: () => void;
	appInitialize: boolean;
}

const initialState: AuthContextModel = {
	setUser: () => {},
	user: new UserModel(),
	signOut: () => {},
	appInitialize: false
};

export const AuthContext = createContext(initialState);

export const AuthWrapper: React.FC<React.PropsWithChildren<{}>> = ({
	children
}: React.PropsWithChildren<{}>) => {
	const [appInitialize, setAppInitialize] = useState<boolean>(false);
	const [user, _setUser] = useState<UserModel>(new UserModel());

	const navigate = useNavigate();
	const { pathname } = useLocation();

	const setUser = (user: UserModel): void => {
		localStorage.setItem(
			Shared.LocalStorageKeys.USER,
			JSON.stringify(user)
		);
		_setUser(user);
	};

	useEffect(() => {
		const itemStr: UserModel =
			(JSON.parse(
				localStorage.getItem(Shared.LocalStorageKeys.USER) as string
			) as UserModel) || new UserModel();
		// if the item doesn't exist, return null
		if (!itemStr.id) {
			pathname === '/register'
				? navigate(RoutePaths.Register)
				: navigate(RoutePaths.Login, { replace: true });
		}
		_setUser(itemStr);
	}, [navigate]);

	const signOut = (): void => {
		setUser(new UserModel());
		localStorage.removeItem(Shared.LocalStorageKeys.USER);
		navigate(RoutePaths.Login, { replace: true });
	};

	useEffect(() => {
		if (pathname === RoutePaths.Login && user.id) {
			navigate(RoutePaths.BookListing);
		}

		if (!user.id) {
			return;
		}

		const access: boolean = Shared.hasAccess(pathname, user);
		if (!access) {
			toast.warning('Sorry, you are not authorized to access this page');
			navigate(RoutePaths.BookListing);
			return;
		}
		setAppInitialize(true);
	}, [pathname, user, navigate]);

	let value: AuthContextModel = {
		user,
		setUser,
		signOut,
		appInitialize
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};

export const useAuthContext = () => {
	return useContext(AuthContext);
};
