
import React from 'react';
import { FormGroup, Input, Label } from 'reactstrap';

export function input(params) {    
    const {
        input,
        label,
        type,
        meta: { touched, error, warning } 
    } = params;
    
    const invalid = !!(touched && error);

    return (
        <FormGroup>
            <Label>{label}</Label>
            <Input invalid={invalid} type={type} {...input} />
            {touched && (
                (error && <div class="invalid-feedback">{error}</div>) ||
                (warning && <div class="invalid-feedback">{warning}</div>)
            )}
        </FormGroup>
    )
}