import React, { Component } from 'react';
import propTypes from 'prop-types';
import paginator from 'paginator';
import {
    ButtonGroup,
    Button,
} from "shards-react";


class Pagination extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount() {

    }
    componentWillUnmount() {
    }

    onChangeValue(pageNUmber) {
        this.props.onChange(pageNUmber);
    }
    
    buildPages() {
        const pages = [];
        const {
            itemsCountPerPage,
            pageRangeDisplayed,
            activePage,
            totalItemsCount,
        } = this.props;

        const paginationInfo = new paginator(
            itemsCountPerPage,
            pageRangeDisplayed
        ).build(totalItemsCount, activePage);
        //result from process above
        // {
        //     total_pages: 
        //     current_page: 
        //     first_page: 
        //     last_page: 
        //     previous_page: 
        //     next_page: 
        //     has_previous_page:
        //     has_next_page: 
        //     total_results:
        //     results: 
        //     first_result: 
        //     last_result: 
        //   }

        for (
            let i = paginationInfo.first_page;
            i <= paginationInfo.last_page;
            i++
        ) {
            pages.push(
                <Button
                    key={i}
                    theme="white"
                    active={i == activePage}
                    onClick={() => this.onChangeValue(i)}>{i}
                </Button>
            )
        }
        pages.unshift(
                <Button
                    key={"prev" + paginationInfo.previous_page}
                    theme="white"
                    disabled={!paginationInfo.has_previous_page}
                    onClick={() => this.onChangeValue(paginationInfo.previous_page)}
                >
                    <i className="material-icons">chevron_left</i>
                </Button>
            );

        pages.unshift(
                <Button
                    key={"first"}
                    theme="white"
                    disabled={!paginationInfo.has_previous_page}
                    onClick={() => this.onChangeValue(1)}
                >
                    <i className="material-icons">first_page</i>
                </Button>
            );

        pages.push(
                <Button
                    key={"next" + paginationInfo.next_page}
                    theme="white"
                    disabled={!paginationInfo.has_next_page}
                    onClick={() => this.onChangeValue(paginationInfo.next_page)}
                >
                    <i className="material-icons">chevron_right</i>
                </Button>
            );

        pages.push(
                <Button
                    key={"last"}
                    theme="white"
                    disabled={paginationInfo.current_page === paginationInfo.total_pages}
                    onClick={() => this.onChangeValue(paginationInfo.total_pages)}
                >
                    <i className="material-icons">last_page</i>
                </Button>
            );

        return pages;
    }
    render() {
        const pages = this.buildPages();

        return (
            <ButtonGroup>
                {pages}
            </ButtonGroup>
        )
    }
}

Pagination.propTypes = {
    totalItemsCount: propTypes.number.isRequired,
    onChange: propTypes.func.isRequired,
    activePage: propTypes.number,
    itemsCountPerPage: propTypes.number,
    pageRangeDisplayed: propTypes.number,
}

Pagination.defaultProps = {
    itemsCountPerPage: 10,
    pageRangeDisplayed: 5,
    activePage: 1,
};

export default Pagination;