import React, { useEffect, useState } from 'react';
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
import categoryService from '../../service/category.service';
import { toast } from 'react-toastify';
import FilterModel from '../../models/FilterModel';
import BaseList from '../../models/BaseList';
import { CategoryModel } from '../../models/CategoryModel';
import ConfirmationDialog from '../../components/ConfirmationDialog';

const Category: React.FC = () => {
	const [filters, setFilters] = useState<FilterModel>(defaultFilter);
	const [categoryRecords, setCategoryRecords] = useState<
		BaseList<CategoryModel[]>
	>({ totalRecords: 0, records: [] });
	const [open, setOpen] = useState<boolean>(false);
	const [selectedId, setSelectedId] = useState<number>(0);

	const navigate = useNavigate();

	useEffect(() => {
		const timer: NodeJS.Timeout = setTimeout(() => {
			if (filters.keyword === '') delete filters.keyword;
			searchAllCategories({ ...filters });
		}, 500);
		return () => clearTimeout(timer);
	}, [filters]);

	const searchAllCategories = (filters: FilterModel): void => {
		categoryService.getAll(filters).then((res) => {
			setCategoryRecords(res);
		});
	};

	const columns = [{ id: 'name', label: 'Category Name', minWidth: 100 }];

	const onConfirmDelete = (): void => {
		categoryService.delete(selectedId).then((res) => {
			toast.success('Record deleted successfully');
			setOpen(false);
			setFilters({ ...filters });
		});
	};
	return (
		<Box sx={productStyle.productWrapper}>
			<div className='container'>
				<Typography variant='h1'>Category</Typography>
				<div className='btn-wrapper'>
					<TextField
						id='text'
						name='text'
						placeholder='Search Category...'
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
						onClick={() => navigate('/add-category')}
					>
						Add New Category
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
							{categoryRecords?.records?.map(
								(row: CategoryModel, index: number) => (
									<TableRow key={row.id}>
										<TableCell>{row.name}</TableCell>
										<TableCell>
											<Button
												type='button'
												className='green-btn btn'
												variant='contained'
												color='primary'
												disableElevation
												onClick={() => {
													navigate(
														`/edit-category/${row.id}`
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
								)
							)}
							{!categoryRecords?.records.length && (
								<TableRow className='TableRow'>
									<TableCell
										colSpan={6}
										className='TableCell'
									>
										<Typography
											align='center'
											className='noDataText'
										>
											No Category
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
						categoryRecords?.records.length
							? categoryRecords.totalRecords
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
					title='Delete category'
					description='Are you sure you want to delete this category?'
				/>
			</div>
		</Box>
	);
};

export default Category;
