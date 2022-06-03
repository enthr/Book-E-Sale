import React, { useEffect, useMemo, useState, useRef } from 'react';
import { productStyle } from './style';
import { defaultFilter, RecordsPerPage } from '../../constant/constant';
import { useNavigate } from 'react-router-dom';
import {
	Typography,
	TextField,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	Button,
	Box
} from '@mui/material';
import bookService from '../../service/book.service';
import { toast } from 'react-toastify';
import categoryService from '../../service/category.service';
import FilterModel from '../../models/FilterModel';
import BaseList from '../../models/BaseList';
import { BookModel } from '../../models/BookModel';
import { CategoryModel } from '../../models/CategoryModel';
import ConfirmationDialog from '../../components/ConfirmationDialog';

const Book: React.FC = () => {
	const isMounted = useRef(false);
	const navigate = useNavigate();
	const [filters, setFilters] = useState<FilterModel>(defaultFilter);
	const [bookRecords, setBookRecords] = useState<BaseList<BookModel[]>>({
		records: [],
		totalRecords: 0
	});
	const [open, setOpen] = useState<boolean>(false);
	const [selectedId, setSelectedId] = useState<number>(0);

	const [categories, setCategories] = useState<CategoryModel[]>([]);

	useEffect(() => {
		if (isMounted.current) return;
		getAllCategories();
		isMounted.current = true;
	}, []);

	const getAllCategories = async (): Promise<void> => {
		await categoryService.getAll({ pageIndex: 0 }).then((res) => {
			if (res) {
				setCategories(res.records);
			}
		});
	};

	const books: BookModel[] = useMemo((): BookModel[] => {
		if (bookRecords?.records) {
			// bookRecords?.records.forEach((element: BookModel) => {
			// 	element.category = categories.find(
			// 		(a) => a.id === element.categoryId
			// 	)?.name;
			// });
			return bookRecords.records;
		}
		return [];
	}, [categories, bookRecords]);

	useEffect(() => {
		const timer: NodeJS.Timeout = setTimeout(() => {
			if (filters.keyword === '') delete filters.keyword;
			searchAllBooks({ ...filters });
		}, 500);
		return () => clearTimeout(timer);
	}, [filters]);

	const searchAllBooks = (filters: FilterModel): void => {
		bookService.getAll(filters).then((res) => {
			setBookRecords(res);
		});
	};

	const columns = [
		{ id: 'name', label: 'Book Name', minWidth: 100 },
		{ id: 'price', label: 'Price', minWidth: 100 },
		{ id: 'category', label: 'Category', minWidth: 100 }
	];

	const onConfirmDelete = (): void => {
		bookService.delete(selectedId).then((res) => {
			toast.success('Record deleted successfully');
			setOpen(false);
			setFilters({ ...filters, pageIndex: 1 });
		});
	};
	return (
		<Box sx={productStyle.productWrapper}>
			<div className='container'>
				<Typography variant='h1'>Book Page</Typography>
				<div className='btn-wrapper'>
					<TextField
						id='text'
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
					<Button
						type='button'
						className='btn pink-btn'
						variant='contained'
						color='primary'
						disableElevation
						onClick={() => navigate('/add-book')}
					>
						Add New Book
					</Button>
				</div>
				<TableContainer>
					<Table aria-label='simple table'>
						<TableHead>
							<TableRow>
								{columns.map((column) => (
									<TableCell
										key={column.id}
										style={{ minWidth: column.minWidth }}
									>
										{column.label}
									</TableCell>
								))}
								<TableCell></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{books?.map((row: BookModel, index) => (
								<TableRow key={row.id}>
									<TableCell>{row.name}</TableCell>
									<TableCell>{row.price}</TableCell>
									<TableCell>{row.category}</TableCell>
									<TableCell>
										<Button
											type='button'
											className='green-btn btn'
											variant='contained'
											color='primary'
											disableElevation
											onClick={() => {
												navigate(
													`/edit-book/${row.id}`
												);
											}}
										>
											Edit
										</Button>
										<Button
											type='button'
											className='btn pink-btn'
											variant='contained'
											color='primary'
											disableElevation
											onClick={() => {
												setOpen(true);
												setSelectedId(row.id ?? 0);
											}}
										>
											Delete
										</Button>
									</TableCell>
								</TableRow>
							))}
							{!bookRecords?.records.length && (
								<TableRow className='TableRow'>
									<TableCell
										colSpan={5}
										className='TableCell'
									>
										<Typography
											align='center'
											className='noDataText'
										>
											No Books
										</Typography>
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={RecordsPerPage}
					component='div'
					count={
						bookRecords?.records.length
							? bookRecords.totalRecords
							: 0
					}
					rowsPerPage={filters.pageSize || 0}
					page={filters.pageIndex - 1}
					onPageChange={(e, newPage) => {
						setFilters({ ...filters, pageIndex: newPage + 1 });
					}}
					onRowsPerPageChange={(e) => {
						setFilters({
							...filters,
							pageIndex: 1,
							pageSize: Number(e.target.value)
						});
					}}
				/>
				<ConfirmationDialog
					open={open}
					onClose={() => setOpen(false)}
					onConfirm={() => onConfirmDelete()}
					title='Delete book'
					description='Are you sure you want to delete this book?'
				/>
			</div>
		</Box>
	);
};

export default Book;
