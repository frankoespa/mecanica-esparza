import { Labels, UserSignin } from '@mecaesparza/shared-data';
import { Form, TextInput, useAuth, useFormManager } from '@mecaesparza/shared-ui';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { FormikHelpers } from 'formik';
import Image from 'next/image';
import React, { useState } from 'react';
import * as Yup from 'yup';

enum StateLogin
{
    Signin = 1,
    Signup = 2
}

function Login ()
{
    const [stateLogin, setStateLogin] = useState(StateLogin.Signin);
    const { SignIn, GetUserContext } = useAuth();

    const onSubmitSignIn = async (userSignin: UserSignin, formikHelpers: FormikHelpers<UserSignin>) =>
    {
        await SignIn(userSignin);
    };

    const formManager = useFormManager<UserSignin>({
        initialValues: {
            Email: ''
        },
        validations: {
            [Labels.Email]: Yup.string().required('requerido')
        },
        onSubmit: onSubmitSignIn
    })

    const handleStateLoginChange = (event: React.SyntheticEvent, newStateLogin: StateLogin) =>
    {
        setStateLogin(newStateLogin);
    };

    // useEffect(() => {
    // 	setTimeout(() => {
    // 		SignIn({
    // 			Email: 'mecanicalresparza@gmail.com',
    // 			Password: '123456'
    // 		});
    // 	}, 5000);
    // });

    return (
        <Box sx={ { display: 'flex', height: '100vh', bgcolor: 'primary.light' } }>
            <Container maxWidth='md' sx={ { display: 'flex' } }>
                <Grid container>
                    <Grid
                        item
                        xs={ 12 }
                        md
                        sx={ {
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingLeft: (theme) => theme.spacing(5),
                            paddingRight: (theme) => theme.spacing(5)
                        } }>
                        <Image src='/portada_login.svg' alt='portada login' width='400' height='300' />
                    </Grid>
                    <Grid
                        item
                        xs={ 12 }
                        md
                        sx={ {
                            display: 'flex',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            paddingLeft: (theme) => theme.spacing(5),
                            paddingRight: (theme) => theme.spacing(5)
                        } }>
                        <Tabs
                            value={ stateLogin }
                            onChange={ handleStateLoginChange }
                            variant='fullWidth'
                            indicatorColor='secondary'
                            textColor='secondary'
                            aria-label='tabs login'
                            sx={ { marginBottom: (theme) => theme.spacing(3) } }>
                            <Tab label={ Labels.CrearCuenta } value={ StateLogin.Signup } />
                            <Tab label={ Labels.Ingresar } value={ StateLogin.Signin } />
                        </Tabs>
                        { stateLogin == StateLogin.Signin ?
                            <Form handleSubmit={ formManager.handleSubmit }>
                                <TextInput
                                    name={ Labels.Email }
                                    label={ Labels.Email }
                                    disabled={ false }
                                    formManager={ formManager }
                                />
                            </Form>
                            : 'SignUP' }
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default Login;

{/* <FormFactory
    initialValues={ {
        [Labels.Email]: ''
    } }
    validations={ {
        [Labels.Email]: Yup.string().required('requerido')
        // [Labels.Password]: YupValidations.Password
    } }
    onSubmit={ onSubmitSignIn }>
    { (form) => (
        <>
            <TextInput
                name={ Labels.Email }
                label={ Labels.Email }
                disabled={ false }
            />
            {/* <PrimaryButton text={ Labels.Ingresar } disabled={ form.isSubmitting || !form.isValid } size='medium' typeSubmit /> */ }
//         </>
//     ) }
// </FormFactory > * /}
