import React, { Component } from 'react';
import { connect } from 'react-redux';
import { emptyData, queryData, filterData, cancelFilter } from '../actions/actions';

import QueryByDate from '../components/QueryByDate';
import QueryByBorough from '../components/QueryByBorough';
import DistanceFilter from  '../components/DistanceFilter';

import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';


export const optionStyle = {
    padding: 10
}

export const buttonProps = {
    fullWidth: true,
    style: {
        marginTop: 10,
        marginBottom: 10
    }
}

class MenuContainer extends Component {
    constructor(props){
        super(props);
        this.state = {
            queryContainerShow: false,
            filterContainerShow: false,
            queryParams: this.props.queryParams,
            showFilterResults: this.props.showFilterResults
        }
    }

    handleToggleQuery = () => {this.setState({queryContainerShow: !this.state.queryContainerShow})}

    handleToggleFilter = () => {this.setState({filterContainerShow: !this.state.filterContainerShow})}

    handleEmpty = () => {this.props.dispatch(emptyData())}
     
    handleQuery = () => {this.state.queryParams.boroughSelected.length !==0 && this.props.dispatch(queryData(this.state.queryParams))}

    handleFilter = () => {this.props.dispatch(filterData(this.state.filterCircle))}

    cancelFilter = () => {this.props.dispatch(cancelFilter())}

    componentWillReceiveProps(nextProps) {
        this.setState({queryParams: nextProps.queryParams, showFilterResults: nextProps.showFilterResults});
    }

    render() {
        return (
            <div id="menu-container">
                <Drawer width={300} openSecondary={true} open={this.state.queryContainerShow}>
                    <AppBar
                        title="查询选项"
                        onTouchTap={this.handleToggleQuery}
                        iconElementLeft={<IconButton><NavigationClose /></IconButton>}
                    />
                    <div style={optionStyle}>
                        <QueryByDate/>
                        <QueryByBorough/>
                        <RaisedButton label="查询" {...buttonProps} primary={true} onTouchTap={this.handleQuery} />
                        <RaisedButton label="清空数据" {...buttonProps} secondary={true} onTouchTap={this.handleEmpty} />
                    </div>
                </Drawer>
                <Drawer width={300} openSecondary={true} open={this.state.filterContainerShow}>
                    <AppBar
                        title="过滤选项"
                        onTouchTap={this.handleToggleFilter}
                        iconElementLeft={<IconButton><NavigationClose /></IconButton>}
                    />
                    <div style={optionStyle}>
                        <DistanceFilter/>
                        <RaisedButton label="过滤" {...buttonProps} primary={true} onTouchTap={this.handleFilter} disabled={this.state.showFilterResults} />
                        <RaisedButton label="取消过滤" {...buttonProps} secondary={true} onTouchTap={this.cancelFilter} />
                    </div>
                </Drawer>

                <div id="menu-button">
                    <IconMenu
                        iconButtonElement={
                            <FloatingActionButton>
                                <ContentAdd />
                            </FloatingActionButton>
                        }
                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                        targetOrigin={{horizontal: 'right', vertical: 'top'}}
                        width={150}
                     >
                     <MenuItem primaryText="按日期/地区查询" onTouchTap={this.handleToggleQuery}/>
                     <MenuItem primaryText="按地理距离过滤" onTouchTap={this.handleToggleFilter}/>
                     <MenuItem primaryText="显示当前数据的统计图表" />
                     </IconMenu>
                </div> 
            </div>
        );
    }
}

export default connect((state) => (state))(MenuContainer);