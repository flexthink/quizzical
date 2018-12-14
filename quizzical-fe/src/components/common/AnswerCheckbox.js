import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import autoBind from 'react-autobind';

const PARAMETERS = {
    select: {
        [true]: {
            color: 'success',
            icon: 'check',
        },
        [false]: {
            color: 'secondary',
            icon: 'question',
        }
    },
    edit: {
        [true]: {
            color: 'success',
            icon: 'check'
        },
        [false]: {
            color: 'danger',
            icon: 'times'
        },
    },
};

export class AnswerCheckbox extends Component {
    constructor(props) {
        super(props);
        this.state = {checked: props.checked};
        autoBind(this);
    }
    
    static getDerivedStateFromProps(props, state) {
        const {checked} = props;
        return {...state, checked};
    }

    parameters() {
        return PARAMETERS[this.props.mode][this.state.checked || false];
    }

    toggle() {
        let {checked} = this.state;
        checked = !checked;
        this.setState({checked});
        if (this.props.onChange) {
            this.props.onChange(checked);
        }
    }

    render() {
        const params = this.parameters();
        return <>
            <Button color={params.color} active={this.state.checked} onClick={this.toggle}>
                <FontAwesomeIcon icon={params.icon} />
            </Button>
        </>;

    }
}

AnswerCheckbox.defaultProps = {
    mode: 'edit'
}

export default AnswerCheckbox;