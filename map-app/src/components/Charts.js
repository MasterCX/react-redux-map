import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Tabs, Tab} from 'material-ui/Tabs';

class Charts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabStatus: 0,
            queryParams: this.props.queryParams
        }
    }

    componentDidMount(){
        //Check data source.
        if(this.props.showFilterResults) {
            //Check filteredData
            this.timeDistributionChart(this.props.filteredData);
            this.vehicleType(this.props.filteredData);
            this.collisionCause(this.props.filteredData);
        } else {
            this.timeDistributionChart(this.props.data);
            this.vehicleType(this.props.data);
            this.collisionCause(this.props.data);
        }
    }

    /**
     * Create collision time distribution statistic chart.
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
            let hour = parseInt(object.TIME.split(":")[0]);
            yCountData[hour]++
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
        return true;
    }

    /**
     * Create vehicle type statistic chart.
     */
    vehicleType = (data) => {
        let vehicleTypeSet = {},
            formattedType = [],
            xTypes = [];
        
        data.map(function(object) {
            vehicleTypeSet[object['VEHICLE TYPE CODE 1']]
                ? vehicleTypeSet[object['VEHICLE TYPE CODE 1']]++
                : vehicleTypeSet[object['VEHICLE TYPE CODE 1']] = 1;
            vehicleTypeSet[object['VEHICLE TYPE CODE 2']]
                ? vehicleTypeSet[object['VEHICLE TYPE CODE 2']]++
                : vehicleTypeSet[object['VEHICLE TYPE CODE 2']] = 1;
            vehicleTypeSet[object['VEHICLE TYPE CODE 3']]
                ? vehicleTypeSet[object['VEHICLE TYPE CODE 3']]++
                : vehicleTypeSet[object['VEHICLE TYPE CODE 3']] = 1;
            return true;
        });

        for(let key in vehicleTypeSet) {
            xTypes.push(key);
            formattedType.push(vehicleTypeSet[key]);
        }

        let option = {
            title: {
                left: 'center',
                text: '事故车辆类型分布'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: xTypes
            },
            grid: {
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
            },
            yAxis: {
                type: 'category',
                data: xTypes
            },
            series: [
                {
                    name: '车辆类型',
                    type: 'bar',
                    data: formattedType
                }
            ]
        };

        let vehicleTypeChart = window.echarts.init(document.getElementById('vehicle-type-container'))
        vehicleTypeChart.setOption(option);
        return true;
    }

    /**
     * Create collision cause statistic chart
     */
    collisionCause = (data) => {
        let collisionCause = {},
            formattedCause = [],
            xTypes = [];

        data.map(function(object) {
            //If key 'factor' exists, value++, else set value = 1
            //Oh god. DRY principle violated.
            collisionCause[object['CONTRIBUTING FACTOR VEHICLE 1']]
                ? collisionCause[object['CONTRIBUTING FACTOR VEHICLE 1']]++
                : collisionCause[object['CONTRIBUTING FACTOR VEHICLE 1']] = 1;
            collisionCause[object['CONTRIBUTING FACTOR VEHICLE 2']]
                ? collisionCause[object['CONTRIBUTING FACTOR VEHICLE 2']]++
                : collisionCause[object['CONTRIBUTING FACTOR VEHICLE 2']] = 1;
            collisionCause[object['CONTRIBUTING FACTOR VEHICLE 3']]
                ? collisionCause[object['CONTRIBUTING FACTOR VEHICLE 3']]++
                : collisionCause[object['CONTRIBUTING FACTOR VEHICLE 3']] = 1;
            collisionCause[object['CONTRIBUTING FACTOR VEHICLE 4']]
                ? collisionCause[object['CONTRIBUTING FACTOR VEHICLE 4']]++
                : collisionCause[object['CONTRIBUTING FACTOR VEHICLE 4']] = 1;
            collisionCause[object['CONTRIBUTING FACTOR VEHICLE 5']]
                ? collisionCause[object['CONTRIBUTING FACTOR VEHICLE 5']]++
                : collisionCause[object['CONTRIBUTING FACTOR VEHICLE 5']] = 1;
            return true;
        })
        
        for(let key in collisionCause) {
            xTypes.push(key);
            formattedCause.push({value: collisionCause[key], name: key});
        }

        let option = {
            title:{
                left: 'center',
                text: '事故原因统计'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c}({d}%)"
            },
            legend: {
                orient: 'verticle',
                x: 'left',
                data: xTypes,
                height: '100%'
            },
            series: [
                {
                    name: '事故原因',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    center: ['60%', "50%"],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center',
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: formattedCause
                }
            ]
        }

        let collisionCauseChart = window.echarts.init(document.getElementById('collision-cause-container'));
        collisionCauseChart.setOption(option);
        return true;
    }
    render() {
        return (
            <div>
                <Tabs>
                    <Tab label="事故日时间分布图">
                        <div>
                            <p className="distance-filter-tip">
                                指定范围内的事故发生时间的分布。事故高发时段请注意出行安全！
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
