import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RoutePaths } from '../utils/enum';
import PrivateRoute from './PrivateRoute';
import { AuthWrapper } from '../context/auth';

//component lazy loading
const Login = lazy(() => import('../pages/login/index'));
const Register = lazy(() => import('../pages/register/index'));
// const User = lazy(() => import('../pages/user/index'));
// const EditUser = lazy(() => import('../pages/user/editUser/index'));
// const Category = lazy(() => import('../pages/category/index'));
// const EditCategory = lazy(() => import('../pages/category/editCategory/index'));
// const Book = lazy(() => import('../pages/book/index'));
// const EditBook = lazy(() => import('../pages/book/editBook/index'));
// const BookList = lazy(() => import('../pages/book-listing/index'));
// const Cart = lazy(() => import('../pages/cart/index'));
// const UpdateProfile = lazy(() => import('../pages/update-profile/index'));

const MainNavigation: React.FC = () => {
	return (
		<Routes>
			<Route path={RoutePaths.Register} element={<Register />} />
			<Route path={RoutePaths.Login} element={<Login />} />
			{/* <PrivateRoute path={RoutePaths.User} element={<User />} />
			<PrivateRoute path={RoutePaths.EditUser} element={<EditUser />} />
			<PrivateRoute path={RoutePaths.Category} element={<Category />} />
			<PrivateRoute
				path={RoutePaths.EditCategory}
				element={<EditCategory />}
			/>
			<PrivateRoute
				path={RoutePaths.AddCategory}
				element={<EditCategory />}
			/>
			<PrivateRoute path={RoutePaths.Book} element={<Book />} />
			<PrivateRoute path={RoutePaths.EditBook} element={<EditBook />} />
			<PrivateRoute path={RoutePaths.AddBook} element={<EditBook />} />
			<PrivateRoute path={RoutePaths.Cart} element={<Cart />} />
			<PrivateRoute
				path={RoutePaths.UpdateProfile}
				element={<UpdateProfile />}
			/> */}
		</Routes>
	);
};

export default MainNavigation;
