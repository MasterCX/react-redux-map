import React, { Component } from 'react';
import { connect } from 'react-redux';

import { setFilterRadius } from '../actions/actions';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';


class DistanceFilter extends Component {
    constructor(props) {
        super(props);
        this.state={
            radius: 0
        }
    }

    handleChange = (event, index, value) => {
        this.setState({radius: value});
        this.props.dispatch(setFilterRadius(value));
    }

    componentWillReceiveProps(nextProps) {
        this.setState({radius: nextProps.distanceFilterRadius});
    }
    render() {
        return (
            <div className="distance-filter">
                <p className="distance-filter-tip">
                    设置过滤范围后，您可以在地图上任意位置<strong>点击右键</strong>，得到以点击位置为中心，过滤范围为半径的圆。
                    点击过滤后，范围内的记录将被保留。
                    <br/>
                    您也可以<strong>拖动</strong>这个圆，放置于需要的位置，再进行过滤。
                </p>
                <p className="distance-filter-tip">
                    过滤操作<strong>不会</strong>修改您的查询结果，您可以点击取消过滤恢复查询结果。
                </p>
                <label htmlFor="none">过滤范围</label>
                <SelectField
                    floatingLabelText="半径距离"
                    value={this.state.radius}
                    onChange={this.handleChange}
                    style={{textAlign: "left"}}
                    maxHeight={240}
                >
                    <MenuItem key="1" value={1} primaryText="1公里" />
                    <MenuItem key="2" value={2} primaryText="2公里" />
                    <MenuItem key="3" value={3} primaryText="3公里" />
                    <MenuItem key="4" value={4} primaryText="4公里" />
                    <MenuItem key="5" value={5} primaryText="5公里" />
                    <MenuItem key="10" value={10} primaryText="10公里" />
                    <MenuItem key="15" value={15} primaryText="15公里" />
                    <MenuItem key="20" value={20} primaryText="20公里" />
                    <MenuItem key="25" value={25} primaryText="25公里" />
                </SelectField>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        distanceFilterRadius: state.distanceFilterRadius
    }
}

export default connect(mapStateToProps)(DistanceFilter);