import React, { useEffect, useState, useRef } from 'react';
import { editUserStyle } from './style';
import {
	Box,
	Typography,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Button
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { materialCommonStyles } from '../../../utils/materialCommonStyles';
import { useNavigate, useParams } from 'react-router-dom';
import userService from '../../../service/user.service';
import ValidationErrorMessage from '../../../components/ValidationErrorMessage/index';
import { toast } from 'react-toastify';
import Role from '../../../models/RoleModel';
import UserModel, { AddOrEditUserModel } from '../../../models/UserModel';
import BaseList from '../../../models/BaseList';
import { AuthContextModel, useAuthContext } from '../../../context/auth';
import Shared from '../../../utils/shared';

const EditUser: React.FC = () => {
	const isMounted = useRef(false);
	const authContext: AuthContextModel = useAuthContext();
	const [roles, setRoles] = useState<Role[]>([]);
	const [user, setUser] = useState<UserModel>();
	const navigate = useNavigate();
	const initialValues: AddOrEditUserModel = {
		id: 0,
		email: '',
		lastName: '',
		firstName: '',
		roleId: 3
	};
	const [initialValueState, setInitialValueState] =
		useState<AddOrEditUserModel>(initialValues);
	const { id } = useParams<{ id?: string }>();

	const validationSchema = Yup.object().shape({
		email: Yup.string()
			.email('Invalid email address format')
			.required('Email is required'),
		firstName: Yup.string().required('First Name is required'),
		lastName: Yup.string().required('Last Name is required'),
		roleId: Yup.number().required('Role is required')
	});

	const getRoles = (): void => {
		userService.getAllRoles().then((res: BaseList<Role[]>) => {
			if (res.records.length) {
				setRoles(res.records);
			}
		});
	};

	const getUserById = (): void => {
		userService.getById(Number(id)).then((res) => {
			if (res) {
				setUser(res);
			}
		});
	};

	const onSubmit = (values: AddOrEditUserModel): void => {
		userService.update(values).then((res) => {
			if (res) {
				toast.success(Shared.messages.UPDATED_SUCCESS);
				navigate('/user', { replace: true });
			}
		});
	};

	useEffect(() => {
		if (isMounted.current) return;
		getRoles();
		isMounted.current = true;
	}, []);

	useEffect(() => {
		if (id) {
			getUserById();
		}
	}, [id]);

	useEffect(() => {
		if (user && roles.length) {
			const roleId = roles.find((role) => role.name === user?.role)
				?.id as number;
			setInitialValueState({
				id: user.id,
				email: user.email,
				lastName: user.lastname,
				firstName: user.firstname,
				roleId,
				password: user.password
			});
		}
	}, [user, roles]);

	return (
		<Box sx={editUserStyle.editUserWrapper}>
			<Box className='container'>
				<Typography variant='h1'>Edit User</Typography>
				<Formik
					initialValues={initialValueState}
					validationSchema={validationSchema}
					enableReinitialize={true}
					onSubmit={onSubmit}
					validator={() => ({})}
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
										name='firstName'
										label='First Name *'
										variant='outlined'
										inputProps={{ className: 'small' }}
										value={values.firstName}
										onBlur={handleBlur}
										onChange={handleChange}
									/>
									<ValidationErrorMessage
										message={errors.firstName}
										touched={touched.firstName}
									/>
								</div>
								<div className='form-col'>
									<TextField
										onBlur={handleBlur}
										onChange={handleChange}
										id='last-name'
										name='lastName'
										label='Last Name *'
										value={values.lastName}
										variant='outlined'
										inputProps={{ className: 'small' }}
									/>
									<ValidationErrorMessage
										message={errors.lastName}
										touched={touched.lastName}
									/>
								</div>
								<div className='form-col'>
									<TextField
										onBlur={handleBlur}
										onChange={handleChange}
										id='email'
										name='email'
										label='Email *'
										value={values.email}
										variant='outlined'
										inputProps={{ className: 'small' }}
									/>
									<ValidationErrorMessage
										message={errors.email}
										touched={touched.email}
									/>
								</div>
								{values.id !== authContext.user.id && (
									<div className='form-col'>
										<FormControl
											className='dropdown-wrapper'
											variant='outlined'
											disabled={
												values.id ===
												authContext.user.id
											}
										>
											<InputLabel htmlFor='select'>
												Roles
											</InputLabel>
											<Select
												name='roleId'
												id={'roleId'}
												onChange={handleChange}
												disabled={
													values.id ===
													authContext.user.id
												}
												sx={
													materialCommonStyles.customSelect
												}
												MenuProps={{
													classes: {
														paper: `${materialCommonStyles.customSelect}`
													}
												}}
												value={values.roleId}
											>
												{roles.length > 0 &&
													roles.map((role: Role) => (
														<MenuItem
															value={role.id}
															key={
																'name' + role.id
															}
														>
															{role.name}
														</MenuItem>
													))}
											</Select>
										</FormControl>
									</div>
								)}
							</div>
							<div className='btn-wrapper'>
								<Button
									className='green-btn btn'
									variant='contained'
									type='submit'
									color='primary'
									disableElevation
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
										navigate('/user');
									}}
								>
									Cancel
								</Button>
							</div>
						</form>
					)}
				</Formik>
			</Box>
		</Box>
	);
};

export default EditUser;
