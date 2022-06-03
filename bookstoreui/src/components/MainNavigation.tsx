import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { RoutePaths } from '../utils/enum';
import PrivateRoute from './PrivateRoute';

//component lazy loading
const Login = lazy(() => import('../pages/login/index'));
const Register = lazy(() => import('../pages/register/index'));
const User = lazy(() => import('../pages/user/index'));
const EditUser = lazy(() => import('../pages/user/editUser/index'));
const Category = lazy(() => import('../pages/category/index'));
const EditCategory = lazy(() => import('../pages/category/editCategory/index'));
const Publisher = lazy(() => import('../pages/publisher/index'));
const EditPublisher = lazy(() => import('../pages/publisher/editPublisher/index'));
const Book = lazy(() => import('../pages/book/index'));
const EditBook = lazy(() => import('../pages/book/editBook/index'));
const BookList = lazy(() => import('../pages/book-listing/index'));
const Cart = lazy(() => import('../pages/cart/index'));
const UpdateProfile = lazy(() => import('../pages/update-profile/index'));

const MainNavigation: React.FC = () => {
	return (
		<Routes>
			<Route path={RoutePaths.Register} element={<Register />} />
			<Route path={RoutePaths.Login} element={<Login />} />
			<Route element={<PrivateRoute />}>
				<Route path={RoutePaths.BookListing} element={<BookList />} />
				<Route path={RoutePaths.User} element={<User />} />
				<Route path={RoutePaths.EditUser} element={<EditUser />} />
				<Route path={RoutePaths.Category} element={<Category />} />
				<Route
					path={RoutePaths.EditCategory}
					element={<EditCategory />}
				/>
				<Route
					path={RoutePaths.AddCategory}
					element={<EditCategory />}
				/>
				<Route path={RoutePaths.Publisher} element={<Publisher />} />
				<Route
					path={RoutePaths.EditPublisher}
					element={<EditPublisher />}
				/>
				<Route
					path={RoutePaths.AddPublisher}
					element={<EditPublisher />}
				/>
				<Route path={RoutePaths.Book} element={<Book />} />
				<Route path={RoutePaths.EditBook} element={<EditBook />} />
				<Route path={RoutePaths.AddBook} element={<EditBook />} />
				<Route path={RoutePaths.Cart} element={<Cart />} />
				<Route
					path={RoutePaths.UpdateProfile}
					element={<UpdateProfile />}
				/>
			</Route>
		</Routes>
	);
};

export default MainNavigation;
