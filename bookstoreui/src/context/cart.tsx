import React, { createContext, useContext, useEffect, useState } from 'react';
import { GetCart } from '../models/CartModel';
import cartService from '../service/cart.service';
import { AuthContextModel, useAuthContext } from './auth';

export interface CartContextModel {
	cartData: GetCart;
	updateCart: () => void;
}

const initialState: CartContextModel = {
	cartData: {
		records: [],
		totalRecords: 0
	},
	updateCart: () => {}
};

export const CartContext = createContext(initialState);

export const CartWrapper: React.FC<React.PropsWithChildren<{}>> = ({
	children
}: React.PropsWithChildren<{}>) => {
	const authContext: AuthContextModel = useAuthContext();

	const [cartData, setCartData] = useState<GetCart>({
		totalRecords: 0,
		records: []
	});

	const updateCart = () => {
		if (authContext.user.id) {
			cartService
				.getList(authContext.user.id)
				.then((res) => setCartData(res));
		}
	};

	let value = {
		cartData,
		updateCart
	};

	useEffect(() => {
		updateCart();
	}, [authContext.user.id]);

	return (
		<CartContext.Provider value={value}>{children}</CartContext.Provider>
	);
};

export const useCartContext = () => {
	return useContext(CartContext);
};
