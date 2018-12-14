import React from 'react';
import IfEmpty from '../common/IfEmpty';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { Button, ButtonGroup } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PaginatedTable from '../common/PaginatedTable';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { getList } from '../../actions/users';


const messages = defineMessages({
    noUsers: {
        id: 'app.user.nousers',
        defaultMessage: 'There are no users'
    },
    email: {
        id: 'app.user.email',
        defaultMessage: 'Email'
    },
    firstName: {
        id: 'app.user.firstname',
        defaultMessage: 'First Name'
    },
    lastName: {
        id: 'app.user.lastname',
        defaultMessage: 'Last Name'
    }
});

export const UserList = injectIntl(({users, onCreate, onEdit, onDelete, onFetch, intl}) => {
    const columns = [
        {
            dataField: 'email',
            text: intl.formatMessage(messages.email),
            sort: true,
        },
        {
            dataField: 'first_name',
            text: intl.formatMessage(messages.firstName),
            sort: true,
        },
        {
            dataField: 'last_name',
            text: intl.formatMessage(messages.lastName),
            sort: true,
        },
        {
            dataField: 'actions',
            isDummyField: true,
            formatter: (cellContent, row) =>
                <ButtonGroup>
                    <Button color="primary" onClick={() => onEdit(row)}>
                        <FontAwesomeIcon icon="edit" />
                        <FormattedMessage id="app.action.edit" defaultMessage="Edit" />
                    </Button>
                    <Button color="danger" onClick={() => onDelete(row)}>
                        <FontAwesomeIcon icon="trash" />
                        <FormattedMessage id="app.action.delete" defaultMessage="Delete" />
                    </Button>
                </ButtonGroup>
        }
    ];
    return <>
        <Button color="primary" onClick={onCreate}>
            <FontAwesomeIcon icon="plus-square" />
            <FormattedMessage id="app.user.new" defaultMessage="New User" />
        </Button>
        <IfEmpty value={users} emptyMessage={intl.formatMessage(messages.noUsers)}>
            <PaginatedTable id="users" keyField="uuid" data={users} columns={columns} fetch={getList()} />
        </IfEmpty>
    </>
});


const mapStateToProps = state => {
    const { users } = state
    return { users: users.allIds.map(id => users.byId[id]) }
}

const mapDispatchToProps = dispatch => ({
    onCreate: () => dispatch(push('/users/new')),
    onEdit: (user) => dispatch(push(`/users/${user.uuid}/edit`))
})

export default connect(mapStateToProps, mapDispatchToProps)(UserList);