import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import { PropTypes } from 'prop-types';
import * as Yup from 'yup';

import { selectUserInfo, loginUser } from '../model/userInfo';
import { FormTextField } from './FormUtils';

import './LoginModal.css';

const LoginModalSchema = Yup.object().shape({
    "username": Yup.string()
        .min(1, 'Too Short!')
        .max(30, 'Too Long!')
        .required('Required'),
});

export const LoginModal = () => {
    const dispatch = useDispatch();
    const userInfo = useSelector(selectUserInfo);

    const onConfirm = (values) => {
        dispatch(loginUser(values["username"]));
    }

    return (
        <Formik
            initialValues={{
                "username": ''
            }}
            validationSchema={LoginModalSchema}
            onSubmit={
                (values, formikBag) => {
                    formikBag.setSubmitting(true)
                    onConfirm(values)
                    formikBag.resetForm();
                    formikBag.setSubmitting(false)
                }
            }
        >
            {(props) => (
                <Modal show={!userInfo.isLogged} scrollable={true} size='lg' backdrop={false}
                    centered={true} dialogClassName="login-modal" >
                    <Form onSubmit={props.handleSubmit} noValidate>
                        <Modal.Header>
                            <Modal.Title>Login</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <FormTextField formikContext={props} name="username" as="input"
                                label="User name" placeholder="John Smith" />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" type="submit" disabled={props.isSubmitting}>Submit</Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            )}
        </Formik >
    );
};

LoginModal.propTypes = {
    topic: PropTypes.object
};
