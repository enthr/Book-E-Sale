import React, { useEffect, useState } from 'react';
import { editStyle } from './style';
import * as Yup from 'yup';
import { Typography, TextField, Button, Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import publisherService from '../../../service/publisher.service';
import { Formik } from 'formik';
import ValidationErrorMessage from '../../../components/ValidationErrorMessage/index';
import { toast } from 'react-toastify';
import { PublisherModel } from '../../../models/PublisherModel';
import RoleModel from '../../../models/RoleModel';

const EditPublisher: React.FC = () => {
	const [roles, setRoles] = useState<RoleModel[]>([]);
	const navigate = useNavigate();
	const initialValues: PublisherModel = new PublisherModel();
	const [initialValueState, setInitialValueState] =
		useState<PublisherModel>(initialValues);
	const { id } = useParams<{ id?: string }>();

	const validationSchema = Yup.object().shape({
		name: Yup.string().required('Category Name is required')
	});

	const getPublisherById = (): void => {
		publisherService.getById(Number(id)).then((res) => {
			setInitialValueState({
				id: res.id,
				name: res.name,
				address: res.address,
				contact: res.contact
			});
		});
	};

	const onSubmit = (values: PublisherModel): void => {
		publisherService.save(values).then((res) => {
			toast.success('Record updated successfully');
			navigate('/publisher');
		});
	};

	useEffect(() => {
		if (id) getPublisherById();
	}, [id]);

	return (
		<Box sx={editStyle.editWrapper}>
			<div className='container'>
				<Typography variant='h1'>
					{id ? 'Edit' : 'Add'} Publisher
				</Typography>
				<Formik
					initialValues={initialValueState}
					validationSchema={validationSchema}
					enableReinitialize={true}
					onSubmit={onSubmit}
				>
					{({
						values,
						errors,
						touched,
						handleBlur,
						handleChange,
						handleSubmit
					}) => (
						<form onSubmit={handleSubmit}>
							<div className='form-row-wrapper'>
								<div className='form-col'>
									<TextField
										id='first-name'
										name='name'
										label='Publisher Name *'
										variant='outlined'
										inputProps={{ className: 'small' }}
										value={values.name}
										onBlur={handleBlur}
										onChange={handleChange}
									/>
									<ValidationErrorMessage
										message={errors.name}
										touched={touched.name}
									/>
								</div>
							</div>
							<div className='form-row-wrapper'>
								<div className='form-col'>
									<TextField
										id='first-name'
										name='address'
										label='Publisher Address *'
										variant='outlined'
										inputProps={{ className: 'small' }}
										value={values.address}
										onBlur={handleBlur}
										onChange={handleChange}
									/>
									<ValidationErrorMessage
										message={errors.name}
										touched={touched.name}
									/>
								</div>
							</div>
							<div className='form-row-wrapper'>
								<div className='form-col'>
									<TextField
										id='first-name'
										name='contact'
										label='Publisher Contact *'
										variant='outlined'
										inputProps={{ className: 'small' }}
										value={values.contact}
										onBlur={handleBlur}
										onChange={handleChange}
									/>
									<ValidationErrorMessage
										message={errors.name}
										touched={touched.name}
									/>
								</div>
							</div>
							<div className='btn-wrapper'>
								<Button
									className='green-btn btn'
									variant='contained'
									type='submit'
									color='primary'
									disableElevation
                                    onSubmit={() => navigate('/publisher')}
								>
									Save
								</Button>
								<Button
									className='pink-btn btn'
									variant='contained'
									type='button'
									color='primary'
									disableElevation
									onClick={() => {
										navigate('/category');
									}}
								>
									Cancel
								</Button>
							</div>
						</form>
					)}
				</Formik>
			</div>
		</Box>
	);
};

export default EditPublisher;
