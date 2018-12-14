import React, { PureComponent } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { connect } from 'react-redux';
import { sortPaginate } from '../../actions/pagination';
import autoBind from 'react-autobind';


class PaginatedTable extends PureComponent {
    constructor(props) {
        super(props);
        autoBind(this);
    }
    handleTableChange(type, { page, sizePerPage, sortField, sortOrder }) {
        const { id, onSortPaginate, fetch } = this.props;
        const settings = {
            limit: sizePerPage,
            offset: page ? sizePerPage * page: 0,
            sort: sortField,
            order: sortOrder
        };
        onSortPaginate(id, settings, fetch );
    }
    render() {
        const {id, ...props} = this.props;
        return <BootstrapTable 
                    remote
                    onTableChange={this.handleTableChange}
                    paginationFactory={paginationFactory()}
                    {...props} /> 
    }
}

/*
export const PaginatedTable = ({id, columns, onSort, onPaginate, ...props}) => {
    const options = {
        onSizePerPageChange: (sizePerPage, page) => onPaginate(id, sizePerPage, page),
        onPageChange: (page, sizePerPage) => onPaginate(id, sizePerPage, page)
    };
    const effectiveColumns =  columns.map(
        column => ({...column, onSort: (field, order) => onSort(id, field, order)}));
    const factory = paginationFactory(options);


    return <BootstrapTable 
                remote
                paginationFactory={ paginationFactory() }
                columns={columns}
                {...props} /> 
} */

const mapDispatchToProps = dispatch => ({
    onSortPaginate: (id, settings, fetch) => dispatch(sortPaginate(id, settings, fetch)),
});

export default connect(null, mapDispatchToProps)(PaginatedTable);