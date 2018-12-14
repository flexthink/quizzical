import React from 'react';
import { Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function() {
    return (
        <Alert color="info">
            <FontAwesomeIcon icon="info-circle" />
            This area is under construction
        </Alert>
    )
}