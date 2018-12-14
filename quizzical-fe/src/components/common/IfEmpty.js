import React from 'react';
import { Alert } from 'reactstrap';

const isEmpty = value => !value || value.length === 0;

const IfEmpty = ({value, emptyMessage, children}) => (
    <>
        {isEmpty(value) ? (
            <Alert color="info">{emptyMessage}</Alert>
        ) : (
            children
        )}
    </>
)

export default IfEmpty;