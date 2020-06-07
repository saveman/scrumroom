import React from 'react'
import { useDispatch } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import { PropTypes } from 'prop-types';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import { loginUser } from '../model/userInfo';
import { FormTextField } from './FormUtils';

import './RoomSelectModal.css';

const RoomSelectModalSchema = Yup.object().shape({
    "roomname": Yup.string()
        .min(1, 'Too Short!')
        .max(30, 'Too Long!')
        .required('Required'),
});

export const RoomSelectModal = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    // const userInfo = useSelector(selectUserInfo);

    const onConfirm = (values) => {
        history.push("/rooms/" + encodeURIComponent(values["roomname"]));
        // dispatch(loginUser(values["roomname"]));
    }

    return (
        <Formik
            initialValues={{
                roomname: ''
            }}
            validationSchema={RoomSelectModalSchema}
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
                <Modal show={true} scrollable={true} size='xl' backdrop={false}
                    centered={true} dialogClassName="room-select-modal" >
                    <Form onSubmit={props.handleSubmit} noValidate>
                        <Modal.Header>
                            <Modal.Title>Enter room name</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <FormTextField formikContext={props} name="roomname" as="input"
                                label="Room name" placeholder="Project Zebra" />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" type="submit" disabled={props.isSubmitting}>Submit</Button>
                            <Link to="/about">About</Link>
                        </Modal.Footer>
                    </Form>
                </Modal>
            )}
        </Formik >
    );
};

RoomSelectModal.propTypes = {
    topic: PropTypes.object
};
