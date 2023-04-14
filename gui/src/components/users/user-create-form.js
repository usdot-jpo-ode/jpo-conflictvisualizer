import { useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  // OutlinedInput,
  Select,
  Switch,
  TextField,
  Typography,
  VisibilityOff,
  Visibility
} from '@mui/material';
import { wait } from '../../../utils/wait';
import { useAuth } from '../../../hooks/use-auth';
import { adminApi } from '../../../apis/admin-api';

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

export const CustomerCreateForm = (props) => {
  const { customer, ...other } = props;
  const router = useRouter();
  const { client } = useAuth();
  const initialValues = {
    email: '',
    phoneNumber: '',
    firstName: '',
    lastName: '',
    username: '',
    role: 'TOC-Operator',
    submit: null
  }
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
      phoneNumber: Yup
        .string()
        .length(10, "Must be a valid phone number")
        .required('Phone number is required'),
      firstName: Yup.string().max(50),
      lastName: Yup.string().max(50),
      username: Yup.string().max(50).required('Username is required'),
      role: Yup.string().max(50).required('Role is required'),
    }),
    onSubmit: async (values, helpers) => {
      try {
        // Must add country code (really only supports USA but can support most of North America)
        let adjustedPhoneNumber = "+1";
        adjustedPhoneNumber = adjustedPhoneNumber.concat(values.phoneNumber);
        const updatedUserAttributes = [];
        updatedUserAttributes.push({
          "Name": "given_name",
          "Value": values.firstName
        });
        updatedUserAttributes.push({
          "Name": "family_name",
          "Value": values.lastName
        });
        updatedUserAttributes.push({
          "Name": "email",
          "Value": values.email
        });
        updatedUserAttributes.push({
          "Name": "email_verified",
          "Value": "True"
        });
        updatedUserAttributes.push({
          "Name": "phone_number",
          "Value": adjustedPhoneNumber
        });
        updatedUserAttributes.push({
          "Name": "phone_number_verified",
          "Value": "True"
        });

        adminApi.createUser(client, values.username, updatedUserAttributes, values.role)
        helpers.setStatus({ success: true });
        helpers.setSubmitting(false);
        toast.success('New User Created!');
        router.push({
          pathname: '/dashboard/users',
          query: { returnUrl: router.asPath }
        }).catch(console.error);
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong!');
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      {...other}>
      <Card>
        <CardHeader title="Create New User" />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.firstName && formik.errors.firstName)}
                fullWidth
                helperText={formik.touched.firstName && formik.errors.firstName}
                label="First name"
                name="firstName"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.firstName}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.lastName && formik.errors.lastName)}
                fullWidth
                helperText={formik.touched.lastName && formik.errors.lastName}
                label="Last name"
                name="lastName"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.lastName}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.email && formik.errors.email)}
                fullWidth
                helperText={formik.touched.email && formik.errors.email}
                label="Email address"
                name="email"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.email}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.username && formik.errors.username)}
                fullWidth
                helperText={formik.touched.username && formik.errors.username}
                label="User Name"
                name="username"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.username}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.phoneNumber && formik.errors.phoneNumber)}
                fullWidth
                helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                label="Phone Number"
                name="phoneNumber"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.phoneNumber}
              />
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
            >
              <Typography>
                Role
              </Typography>
              <Select
                value={formik.values.role}
                label="Role"
                name="role"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              >
                <MenuItem value={"Admin"}>Administrator</MenuItem>
                <MenuItem value={"TOC-Manager"}>TOC Manager</MenuItem>
                <MenuItem value={"TOC-Operator"}>TOC Operator</MenuItem>
              </Select>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3 }} />
        </CardContent>
        <CardActions
          sx={{
            flexWrap: 'wrap',
            m: -1
          }}
        >
          <Button
            disabled={formik.isSubmitting}
            type="submit"
            sx={{ m: 1 }}
            variant="contained"
          >
            Create
          </Button>
          <NextLink
            href="/dashboard/users"
            passHref
          >
            <Button
              component="a"
              disabled={formik.isSubmitting}
              sx={{
                m: 1,
                mr: 'auto'
              }}
              variant="outlined"
            >
              Cancel
            </Button>
          </NextLink>
        </CardActions>
      </Card>
    </form >
  );
};

CustomerCreateForm.propTypes = {
  customer: PropTypes.object.isRequired
};
