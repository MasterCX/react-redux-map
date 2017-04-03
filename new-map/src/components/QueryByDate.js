import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setQueryParams } from '../actions/actions';
import DatePicker from 'material-ui/DatePicker';

import { optionStyle } from '../containers/MenuContainer';

const datePickerOptions = {
    mode: 'landscape',
    container: 'inline',
    autoOk: true
}

class QueryByDate extends Component{
    constructor(props){
        super(props);
        this.state = {
            queryParams: this.props.queryParams,
            startDateMaxBound: new Date(),
            dueDateMinBound: new Date(),
        }
    }

    updateParams = (newParams) => {
        this.setState({queryParams: newParams});
        this.props.dispatch(setQueryParams(newParams));
    }

    handleStartDateChange = (event, date) => {
        let queryParams = Object.assign({}, this.props.queryParams)
        queryParams.startDate = date.toLocaleDateString();
        this.setState({dueDateMinBound: date});
        this.updateParams(queryParams);
    }

    handleDueDateChange = (event, date) => {
        let queryParams = Object.assign({}, this.props.queryParams)
        queryParams.dueDate = date.toLocaleDateString();
        this.setState({startDateMaxBound: date});
        this.updateParams(queryParams);
    }

    render() {
        return (
            <div className="date-filter">
                <div style={optionStyle}>
                    <label className="filter-name" htmlFor="none">时间区间</label>
                    <DatePicker
                        hintText={this.props.queryParams.startDate || "起始日期"}
                        ref="startDate"
                        maxDate={this.state.startDateMaxBound}
                        {...datePickerOptions}
                        onChange={this.handleStartDateChange}/>
                    <DatePicker
                        hintText={this.props.queryParams.dueDate ||"终止日期"}
                        ref="dueDate"
                        minDate={this.state.dueDateMinBound}
                        {...datePickerOptions}
                        onChange={this.handleDueDateChange}/>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        queryParams: state.queryParams
    }
}

export default connect(mapStateToProps)(QueryByDate);