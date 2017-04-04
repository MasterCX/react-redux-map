import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Tabs, Tab} from 'material-ui/Tabs';

class Charts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabStatus: 0,
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps')
        console.log(document.getElementById('chart-container'));
    }

    componentDidUpdate(){
        console.log('componentDidUpdate')
        console.log(document.getElementById('chart-container'));
    }

    componentDidMount(){
        console.log('componentDidMount')
        console.log(document.getElementById('time-dist-container'));
        this.timeDistributionChart(this.props.data);
    }

    /**
     * Create collision time distribution stastic chart.
     */
    timeDistributionChart = (data) => {
        let yCountData = new Array(24),
            xTimeData = new Array(24);

        //Prepare x axis data: hours of one day.
        for(let i = 0; i < xTimeData.length; i++) {
            xTimeData[i] = i.toString() + ":00"; 
        }

        //Initialize yCountData
        for(let i = 0; i < yCountData.length; i++) {
            yCountData[i] = 0
        }

        //Prepare y axis data: yCount collision times in each hour.
        data.map(function(object) {
            console.log(object.TIME)
            let hour = parseInt(object.TIME.split(":")[0]);
            yCountData[hour]++
            console.log(yCountData[hour]);
            return true;
        })

        let option = {
            title: {
                left: 'center',
                text: '事故日时间分布统计'
            },
            color: ['#3398DB'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: xTimeData,
                    axisTick: {
                        alignWithLabel: false
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '事故频数',
                    type: 'bar',
                    barWidth: '50%',
                    data: yCountData
                }
            ]
        };

        let timeDistributionChart = window.echarts.init(document.getElementById('time-dist-container'));
        timeDistributionChart.setOption(option); 
    }

    /**
     * Create vehicle type stastic chart.
     */
    vehicleType = () => {
        console.log('render')
        console.log(document.getElementById('chart-container'));
    }

    /**
     * Create collision cause stastic chart.
     */
    collisionCause = (data) => {

    }
    render() {
        return (
            <div>
                <Tabs>
                    <Tab label="事故日时间分布图">
                        <div>
                            <p className="distance-filter-tip">
                                <strong>{this.props.queryParams.startDate}</strong>到<strong>{this.props.queryParams.dueDate}</strong>期间，指定范围内的事故发生时间的分布。事故高发时段请注意出行安全！
                            </p>
                            <div id="time-dist-container" className="chart-container">
                            </div>
                        </div>
                    </Tab>
                    <Tab label="事故车辆类型分布">
                        <div>
                            <p className="distance-filter-tip">
                            当前数据中，事故当事车辆类型的统计。
                            </p>
                            <div id="vehicle-type-container" className="chart-container">
                            </div>
                        </div>
                    </Tab>
                    <Tab label="事故原因统计">
                        <div>
                            <p className="distance-filter-tip">
                            事故原因统计。
                            </p>
                            <div id="collision-cause-container" className="chart-container">
                            </div>
                        </div>
                    </Tab>
    
                </Tabs>
            </div>
       )
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.data,
        filteredData: state.filteredData,
        queryParams: state.data,
        showFilterResults: state.showFilterResults,
        distanceFilterRadius: state.distanceFilterRadius
    }
}

export default connect(mapStateToProps)(Charts); 
