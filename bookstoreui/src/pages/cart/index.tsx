import React, { useEffect, useState } from 'react';
import { cartStyle } from './style';
import { Typography, Button, Link, Box } from '@mui/material';
import { CartList } from '../../models/CartModel';
import cartService from '../../service/cart.service';
import { AuthContextModel, useAuthContext } from '../../context/auth';
import { toast } from 'react-toastify';
import orderService from '../../service/order.service';
import { OrderAddModel, SubOrderModel } from '../../models/OrderModel';
import Shared from '../../utils/shared';
import { CartContextModel, useCartContext } from '../../context/cart';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
	const authContext: AuthContextModel = useAuthContext();
	const cartContext: CartContextModel = useCartContext();
	const navigate = useNavigate();

	const [BookList, setBookList] = useState<CartList[]>([]);
	const [ItemsInCart, setItemsInCart] = useState<number>(0);
	const [TotalPrice, setTotalPrice] = useState<number>(0);

	const getTotalPrice = (ItemList: CartList[]) => {
		let totalPrice = 0;
		ItemList.map((item: CartList) => {
			const itemPrice = item.quantity * parseInt(item.book.price);
			totalPrice = totalPrice + itemPrice;
		});
		setTotalPrice(totalPrice);
	};

	useEffect(() => {
		setBookList(cartContext.cartData.records);
		setItemsInCart(cartContext.cartData.totalRecords);
		getTotalPrice(cartContext.cartData.records);
	}, [cartContext.cartData.records, cartContext.cartData.totalRecords]);

	const removeItem = async (id: number) => {
		try {
			const res = await cartService.removeItem(id);
			if (res) {
				cartContext.updateCart();
			}
		} catch (error) {
			toast.error('Somthing went wrong!');
		}
	};

	const updateQuantity = async (cartItem: CartList, inc: Boolean, e: any) => {
		const current_count = parseInt(
			e.target.closest('.qty-group').children[1].innerText
		);

		const quantity = inc ? current_count + 1 : current_count - 1;
		if (quantity === 0) {
			toast.error('Item quantity should not be zero');
			return;
		}

		cartService
			.updateItem({
				id: cartItem.id,
				userId: cartItem.userId,
				bookId: cartItem.book.id as number,
				quantity
			})
			.then((res) => {
				if (res) {
					const item: CartList | undefined = BookList.find(
						(item) => item.book.id === cartItem.book.id
					);
					if (item) {
						const current_div_count: number = parseInt(
							e.target.closest('.qty-group').children[1].innerText
						);
						const newCount = inc
							? current_div_count + 1
							: current_div_count - 1;
						e.target.closest('.qty-group').children[1].innerText =
							newCount;
						const newPrice = inc
							? TotalPrice + parseInt(item.book.price)
							: TotalPrice - parseInt(item.book.price);
						setTotalPrice(newPrice);
					}
				}
			});
	};

	const PlcaeOrder = async () => {
		if (authContext.user.id) {
			const userCart = await cartService.getList(authContext.user.id);

			if (userCart.totalRecords) {
				let subOrders: SubOrderModel[] = [];
				userCart.records.forEach((element: CartList) => {
					const subOrder: SubOrderModel = {
						bookId: Number(element.book.id),
						quantity: element.quantity,
						price: Number(element.book.price),
						totalPrice:
							Number(element.quantity) *
							Number(element.book.price)
					};
					subOrders.push(subOrder);
				});

				const newOrder: OrderAddModel = {
					userId: authContext.user.id,
					orderDate: new Date().toISOString(),
					subOrders: subOrders,
					totalPrice: TotalPrice
				};

				const res = await orderService.placeOrder(newOrder);
				if (res) {
					cartContext.updateCart();
					navigate('/');
					toast.success(Shared.messages.ORDER_SUCCESS);
				}
			} else {
				toast.error('Your cart is empty');
			}
		}
	};

	return (
		<Box sx={cartStyle.cartWrapper}>
			<div className='container'>
				<Typography variant='h1'>Cart page</Typography>
				<div className='cart-heading-block'>
					<Typography variant='h2'>
						My Shopping Bag ({ItemsInCart} Items)
					</Typography>
					<div className='total-price'>Total price: {TotalPrice}</div>
				</div>
				<div className='cart-list-wrapper'>
					{BookList.map((cartItem: CartList) => {
						return (
							<div className='cart-list-item' key={cartItem.id}>
								<div className='cart-item-img'>
									<Link>
										<img
											src={cartItem.book.base64image}
											alt='dummy-image'
										/>
									</Link>
								</div>
								<div className='cart-item-content'>
									<div className='cart-item-top-content'>
										<div className='cart-item-left'>
											<p className='brand'>
												{cartItem.book.name}
											</p>
										</div>
										<div className='price-block'>
											<span className='current-price'>
												MRP &#8377;{' '}
												{cartItem.book.price}
											</span>
										</div>
									</div>
									<div className='cart-item-bottom-content'>
										<div className='qty-group'>
											<Button
												className='btn pink-btn'
												onClick={(e: any) =>
													updateQuantity(
														cartItem,
														true,
														e
													)
												}
											>
												+
											</Button>
											<span className='number-count'>
												{cartItem.quantity}
											</span>
											<Button
												className='btn pink-btn'
												onClick={(e: any) =>
													updateQuantity(
														cartItem,
														false,
														e
													)
												}
											>
												-
											</Button>
										</div>
										<Link
											onClick={() =>
												removeItem(cartItem.id)
											}
										>
											Remove
										</Link>
									</div>
								</div>
							</div>
						);
					})}
				</div>
				<div className='btn-wrapper'>
					<Button className='btn pink-btn' onClick={PlcaeOrder}>
						Place order
					</Button>
				</div>
			</div>
		</Box>
	);
};

export default Cart;
