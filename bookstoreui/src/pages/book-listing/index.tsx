import React, { useEffect, useMemo, useState, useRef } from 'react';
import { productListingStyle } from './style';
import { materialCommonStyles } from '../../utils/materialCommonStyles';
import {
	Typography,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	TextField,
	Grid,
	Box,
	Pagination
} from '@mui/material';
import prodcutImage from '../../assets/images/dummy-image.jpg';
import BaseList from '../../models/BaseList';
import { BookModel } from '../../models/BookModel';
import FilterModel from '../../models/FilterModel';
import bookService from '../../service/book.service';
import { defaultFilter } from '../../constant/constant';
import categoryService from '../../service/category.service';
import { CategoryModel } from '../../models/CategoryModel';
import { AuthContextModel, useAuthContext } from '../../context/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '../../utils/enum';
import Shared from '../../utils/shared';
import { CartContextModel, useCartContext } from '../../context/cart';

const BookList: React.FC = () => {
	const isMounted = useRef(false);
	const authContext: AuthContextModel = useAuthContext();
	const cartContext: CartContextModel = useCartContext();
	const navigate = useNavigate();
	const [bookList, setBookList] = useState<BaseList<BookModel[]>>({
		records: [],
		totalRecords: 0
	});
	const [categories, setCategories] = useState<CategoryModel[]>([]);
	const [sortBy, setSortBy] = useState<'a-z' | 'z-a'>();
	const [filters, setFilters] = useState<FilterModel>(defaultFilter);

	useEffect(() => {
		if (isMounted.current) return;
		getAllCategories();
		isMounted.current = true;
	}, []);

	useEffect(() => {
		const timer: NodeJS.Timeout = setTimeout(() => {
			// if (filters.keyword === '') delete filters.keyword;
			searchAllBooks({ ...filters });
		}, 500);
		return () => clearTimeout(timer);
	}, [filters]);

	const searchAllBooks = (filters: FilterModel): void => {
		bookService.getAll(filters).then((res) => {
			setBookList(res);
		});
	};

	const getAllCategories = async (): Promise<void> => {
		await categoryService.getAll({ pageIndex: 0 }).then((res) => {
			if (res) {
				setCategories(res.records);
			}
		});
	};

	const books: BookModel[] = useMemo((): BookModel[] => {
		if (bookList?.records) {
			bookList?.records.forEach((element: BookModel) => {
				element.category = categories.find(
					(a) => a.id === element.categoryId
				)?.name;
			});
			return bookList.records;
		}
		return [];
	}, [categories, bookList]);

	const addToCart = (book: BookModel): void => {
		if (!authContext.user.id) {
			toast.error('Please login before adding books to cart');
			navigate(RoutePaths.Register);
			return;
		} else {
			Shared.addToCart(book, authContext.user.id).then((res) => {
				if (res.error) {
					toast.error(res.message);
				} else {
					toast.success(res.message);
					cartContext.updateCart();
				}
			});
		}
	};

	const sortBooks = (e: any) => {
		setSortBy(e.target.value);
		bookList.records.sort((a, b) => {
			if (a.name < b.name) {
				return e.target.value === 'a-z' ? -1 : 1;
			}
			if (a.name > b.name) {
				return e.target.value === 'a-z' ? 1 : -1;
			}
			return 0;
		});
	};

	return (
		<Box sx={productListingStyle.productListWrapper}>
			<div className='container'>
				<Typography variant='h1'>Book Listing</Typography>
				<Grid container className='title-wrapper'>
					<Grid item xs={6}>
						<Typography variant='h2'>
							Total
							<span> - {bookList.totalRecords} items</span>
						</Typography>
					</Grid>
					<div className='dropdown-wrapper'>
						<TextField
							id='text'
							className='dropdown-wrapper'
							name='text'
							placeholder='Search...'
							variant='outlined'
							inputProps={{ className: 'small' }}
							onChange={(e) => {
								setFilters({
									...filters,
									keyword: e.target.value,
									pageIndex: 1
								});
							}}
						/>
					</div>
					<FormControl
						className='dropdown-wrapper'
						variant='outlined'
					>
						<InputLabel htmlFor='select'>Sort By</InputLabel>
						<Select
							sx={materialCommonStyles.customSelect}
							MenuProps={{
								classes: {
									paper: `${materialCommonStyles.customSelect}`
								}
							}}
							onChange={sortBooks}
							value={sortBy}
						>
							<MenuItem value='a-z'>a - z</MenuItem>
							<MenuItem value='z-a'>z - a</MenuItem>
						</Select>
					</FormControl>
				</Grid>
				<div className='product-list-wrapper'>
					<div className='product-list-inner-wrapper'>
						{books.map((book: BookModel) => (
							<div className='product-list' key={book.id}>
								<div className='product-list-inner'>
									<em>
										<img
											src={book.base64image}
											className='image'
											alt='dummy-image'
										/>
									</em>
									<div className='content-wrapper'>
										<Typography variant='h3'>
											{book.name}
										</Typography>
										<span className='category'>
											{book.category}
										</span>
										<p className='description'>
											{book.description}
										</p>
										<p className='price'>
											<span className='discount-price'>
												MRP &#8377; {book.price}
											</span>
										</p>
										<button className='MuiButtonBase-root MuiButton-root MuiButton-contained btn pink-btn MuiButton-containedPrimary MuiButton-disableElevation'>
											<span
												className='MuiButton-label'
												onClick={() => addToCart(book)}
											>
												ADD TO CART
											</span>
											<span className='MuiTouchRipple-root'></span>
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
				<div className='pagination-wrapper'>
					<Pagination
						count={Math.ceil(
							(bookList?.records.length
								? bookList.totalRecords
								: 0) / 10
						)}
						page={filters.pageIndex}
						onChange={(e, newPage) => {
							setFilters({ ...filters, pageIndex: newPage });
						}}
					/>
				</div>
			</div>
		</Box>
	);
};

export default BookList;
