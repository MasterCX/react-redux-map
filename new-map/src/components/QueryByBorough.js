import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setQueryParams } from '../actions/actions'
import CircularProgress from 'material-ui/CircularProgress';
import SelectedField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { optionStyle } from '../containers/MenuContainer';

class QueryByBorough extends Component{
    constructor(props) {
        super(props);
        this.state = {
            boroughSelected: [],
            fetchingBoroughList: false,
            boroughList:[],
            queryParams: this.props.queryParams
        }
    }

    handleChange = (event, index, values) => {
        let queryParams = Object.assign({}, this.state.queryParams)
        queryParams.boroughSelected = values;
        this.setState({boroughSelected: values});
        this.props.dispatch(setQueryParams(queryParams));
    } 

    componentDidMount() {
        this.setState({fetchingBoroughList: true});
        fetch('http://127.0.0.1:4000/getBoroughs')
            .then(response => response.json())
            .then(json => this.setState({boroughList: json, fetchingBoroughList: false}));
    }

    componentWillReceiveProps(nextProps) {
        this.setState({queryParams: nextProps.queryParams});
    }
    
    menuItems(values) {
        return this.state.boroughList.map((borough) => (
            <MenuItem
                key={borough.BOROUGH || 'unknown'}
                insetChildren={true}
                checked={values && values.includes(borough.BOROUGH || 'unknown')}
                value={borough.BOROUGH || 'unknown'}
                primaryText={borough.BOROUGH || '未知'}
            />
        ));
    }

    render() {
        const {boroughSelected} = this.state;
        return (
            <div className="borough-filter">
                <div style={optionStyle}>
                    <label className="filte"htmlFor="none">市镇区域</label>
                    <br/>
                    {this.state.fetchingBoroughList
                        ? <CircularProgress id="borough-list-loading" size={30} thickness={7} />
                        : <SelectedField
                            multiple={true}
                            floatingLabelText="区域" 
                            value={this.state.boroughSelected} 
                            onChange={this.handleChange}
                            errorText={!this.state.boroughSelected.length && "请至少选择一个区域"}
                            style={{textAlign: "left"}}
                            >
                            {this.menuItems(boroughSelected)}
                            </SelectedField>
                    }
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

export default connect(mapStateToProps)(QueryByBorough);