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
import publisherService from '../../service/publisher.service';
import { toast } from 'react-toastify';
import FilterModel from '../../models/FilterModel';
import BaseList from '../../models/BaseList';
import { PublisherModel } from '../../models/PublisherModel';
import ConfirmationDialog from '../../components/ConfirmationDialog';

const Publisher: React.FC = () => {
	const [filters, setFilters] = useState<FilterModel>(defaultFilter);
	const [publisherRecords, setPublisherRecords] = useState<
		BaseList<PublisherModel[]>
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
		publisherService.getAll(filters).then((res) => {
			setPublisherRecords(res);
		});
	};

	const columns = [
		{ id: 'name', label: 'Publisher Name', minWidth: 100 },
		{ id: 'address', label: 'Publisher Address', minWidth: 100 },
		{ id: 'contact', label: 'Publisher Contact', minWidth: 100 }
	];

	const onConfirmDelete = (): void => {
		publisherService.delete(selectedId).then((res) => {
			toast.success('Record deleted successfully');
			setOpen(false);
			setFilters({ ...filters });
		});
	};
	return (
		<Box sx={productStyle.productWrapper}>
			<div className='container'>
				<Typography variant='h1'>Publisher</Typography>
				<div className='btn-wrapper'>
					<TextField
						id='text'
						name='text'
						placeholder='Search Publisher...'
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
						onClick={() => navigate('/add-publisher')}
					>
						Add New Publisher
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
							{publisherRecords?.records?.map(
								(row: PublisherModel, index: number) => (
									<TableRow key={row.id}>
										<TableCell>{row.name}</TableCell>
										<TableCell>{row.address}</TableCell>
										<TableCell>{row.contact}</TableCell>
										<TableCell>
											<Button
												type='button'
												className='green-btn btn'
												variant='contained'
												color='primary'
												disableElevation
												onClick={() => {
													navigate(
														`/edit-publisher/${row.id}`
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
							{!publisherRecords?.records.length && (
								<TableRow className='TableRow'>
									<TableCell
										colSpan={6}
										className='TableCell'
									>
										<Typography
											align='center'
											className='noDataText'
										>
											No Publisher
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
						publisherRecords?.records.length
							? publisherRecords.totalRecords
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

export default Publisher;
