import React from 'react'
import { Form } from 'react-bootstrap';
import { PropTypes } from 'prop-types';

export const FormTextField = ({ formikContext, name, as, type, label, placeholder, value }) => (
    <Form.Group controlId={name}>
        <Form.Label>{label}</Form.Label>
        <Form.Control
            as={as}
            type={type}
            placeholder={placeholder}
            value={formikContext ? formikContext.values[name] : value}
            onChange={formikContext ? formikContext.handleChange : null}
            onBlur={formikContext ? formikContext.handleBlur : null}
            isInvalid={formikContext ? (formikContext.touched[name] && formikContext.errors[name]) : false}
            readOnly={formikContext ? false : true}
        />
        <Form.Control.Feedback type="invalid">{formikContext ? formikContext.errors[name] : ''}</Form.Control.Feedback>
    </Form.Group>
);

FormTextField.propTypes = {
    formikContext: PropTypes.object,
    name: PropTypes.string.isRequired,
    as: PropTypes.string.isRequired,
    type: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
        PropTypes.number
    ])
}

FormTextField.defaultProps = {
    as: 'input',
    placeholder: ''
}
