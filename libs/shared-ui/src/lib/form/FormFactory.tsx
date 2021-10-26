import { ViewModel } from '@mecaesparza/shared-data';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import * as Yup from 'yup';
import { ObjectShape } from 'yup/lib/object';

interface IProps
{
    children: (formUtils: FormikProps<ViewModel>) => JSX.Element | JSX.Element[];
    initialValues: ViewModel;
    validations: ObjectShape;
    onSubmit: (values: ViewModel, form: FormikHelpers<ViewModel>) => Promise<void>;
}

export function FormFactory (props: IProps)
{
    const { children, initialValues, validations, onSubmit } = props;

    const onSubmitForm = async (
        values: ViewModel,
        formikHelpers: FormikHelpers<ViewModel>
    ) =>
    {
        await onSubmit(Yup.object().shape(validations).cast(values), formikHelpers);
    };

    return (
        <Formik
            enableReinitialize={ true }
            initialValues={ initialValues }
            onSubmit={ onSubmitForm }
            validationSchema={ Yup.object().shape(validations) }
        >
            { (formUtils) => (
                <Form translate="yes" autoComplete="off" style={ { width: '100%' } }>
                    { children(formUtils) }
                </Form>
            ) }
        </Formik>
    );
}