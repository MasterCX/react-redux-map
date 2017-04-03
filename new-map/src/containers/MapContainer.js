import React, { Component } from 'react';
import { connect } from 'react-redux';
import { cancelFilter } from '../actions/actions'
import LinearProgress from 'material-ui/LinearProgress';
import Snackbar from 'material-ui/Snackbar';

/**
 * Map config for map initialization and global objects.
 * Global objects: 
 * map;
 * content object for collision detail infowindow;
 * circle for distance filter;
 * array of markers.
 * These methods are for google map manipulations.
 * Since google map is registered as a global(window) property,
 * it is unconvenient to manipulate it within React components.
 */
const MAPCONFIG = {
    center: {
        lat: 40.7431952,
        lng: -73.978469
    },
    zoom: 11,
    mapTypeId: window.google.maps.MapTypeId.ROADMAP
}

let map,
    circle,
    markers = [],
    radius,
    collisionDetail = new window.google.maps.InfoWindow({
        content: ''
    })

/**
 * Transfer data records to structured HTML string.
 * @param {*Array} data 
 * @return {*String} htmlString
 */
function dataToHTML(data) {
    let htmlString = '<div class="detail-info-window"><h2>事故详情</h3>';
    
    htmlString += '<h3>基本信息</h3>'
                + '<hr>'
                + '<strong>事发区域:</strong>' + ( data.BOROUGH || "未知" ) + '<br>'
                + '<strong>事发日期:</strong>' + data.DATE + '<br>'
                + '<strong>事发时间:</strong>' + data.TIME + '<br>'
                + '<strong>肇事车辆1类型:</strong>' + ( data['VEHICLE TYPE CODE 1'] || "未知" ) + '<br>'
                + '<strong>肇事车辆2类型:</strong>' + ( data['VEHICLE TYPE CODE 2'] || "未知" ) + '<br>';

    data['VEHICLE TYPE CODE 3']
        && (htmlString += '<strong>肇事车辆3类型:</strong>' + data['VEHICLE TYPE CODE 3'] + '<br>');

    data['VEHICLE TYPE CODE 4']
        && (htmlString += '<strong>肇事车辆4类型:</strong>' + data['VEHICLE TYPE CODE 3'] + '<br>');


    data['CROSS STREET NAME']
        && (htmlString += ' <strong>交汇街道:</strong>' + data['CROSS STREET NAME'] + '<br>');

    data['CONTRIBUTING FACTOR VEHICLE 1']
        && (htmlString += ' <strong>肇事原因1:</strong>' + data['CONTRIBUTING FACTOR VEHICLE 1'] + '<br>');
    
    data['CONTRIBUTING FACTOR VEHICLE 2']
        && (htmlString += ' <strong>肇事原因2:</strong>' + data['CONTRIBUTING FACTOR VEHICLE 2'] + '<br>');

    data['CONTRIBUTING FACTOR VEHICLE 3']
        && (htmlString += ' <strong>肇事原因3:</strong>' + data['CONTRIBUTING FACTOR VEHICLE 2'] + '<br>');

    data['CONTRIBUTING FACTOR VEHICLE 4']
        && (htmlString += ' <strong>肇事原因4:</strong>' + data['CONTRIBUTING FACTOR VEHICLE 2'] + '<br>');

    data['CONTRIBUTING FACTOR VEHICLE 5']
        && (htmlString += ' <strong>肇事原因5:</strong>' + data['CONTRIBUTING FACTOR VEHICLE 2'] + '<br>');

    data['City Council Districts']
        && (htmlString += ' <strong>市议会区代码:</strong>' + data['City Council Districts'] + '<br>');
    
    htmlString += '<h3>伤亡情况</h3>'
                + '<hr>';

    htmlString += (data['NUMBER OF PERSONS KILLED'] || 0) + '人死亡,'
                + (data['NUMBER OF PERSONS INJURED'] || 0) + '人受伤。'
                + '<br>'
                + (data['NUMBER OF PEDSTRAINS KILLED'] || 0) + '位行人死亡,'
                + (data['NUMBER OF PEDSTRAINS INJURED'] || 0) + '位行人受伤。'
                + '<br>'
                + (data['NUMBER OF CYCLIST KILLED'] || 0) + '位自行车骑行者死亡,'
                + (data['NUMBER OF CYCLIST INJURED'] || 0) + '自行车骑行者受伤。'
                + '<br>'
                + (data['NUMBER OF MOTORIST KILLED'] || 0) + '位摩托车骑行者死亡,'
                + (data['NUMBER OF MOTORIST INJURED'] || 0) + '位摩托车骑行者受伤。'
                + '<br>';

    return htmlString;
}

/**
 * Add a circle on the map.
 * This function goes here because it will be called 
 * in a global object 'map'. So there is no method (so far as I know)
 * to call this function using 'this'. Hence this function should not
 * be placed in any class or function.
 * @param {*} center 
 * @param {*} radius 
 */
function addCircle(center, radius) {
    let circleConfig = {
        strokeColor: '#FF0000',
        strokeOpacity: 0.5,
        strokeWeight: 1,
        fillColor: '#FF0000',
        fillOpacity: 0.1,
        map: map,
        center: center,
        radius: radius*1000,
        draggable: true
    };
    removeCircle();
    circle = new window.google.maps.Circle(circleConfig);
}

/** 
 * Remove the circle.
 * Same as last function.
 */
function removeCircle() {
    if (circle) {
        circle.setMap(null);
        circle = null;
    }
    return true;
}

/**
 * Add a contains() method similar to 'cationContains' of class polygen 
 */
window.google.maps.Circle.prototype.contains = function(latLng) {
  return this.getBounds().contains(latLng)
    && window.google.maps.geometry.spherical.computeDistanceBetween(this.getCenter(), latLng) <= this.getRadius();
}

class MapContainer extends Component {
    /**
     * Initialize map component propeties
     */
    constructor(props) {
        super(props);
        this.state = {
            snackbarShow: false,
            message: '',
            dataToHTML: this.dataToHTML,
        }
    }

    /**
     * Create a google map instance when component loaded for the first time.
     * Assign this map instance to a global object so that other methods can access.
     */
    componentDidMount() {
        let mapInstance = new window.google.maps.Map(
            document.getElementById('map'),
            MAPCONFIG
        );
        //Assign the map instance to global object.
        map = mapInstance;
        
        //Bind right click event for map itself.
        //Event handler: show right click menu.
        map.addListener('rightclick', function(ev){
            let position = {
                lat: ev.latLng.lat(),
                lng: ev.latLng.lng()
            };
            addCircle(position, radius)
        });
    }

    /**
     * If fetch complete and data is valid, render map markers.
     * Else show error/empty message.
     */
    componentWillReceiveProps(nextProps) {
        //Prepare new filter radius.
        radius = nextProps.distanceFilterRadius;

        //Check request state.
        if(!nextProps.isFetching) {
            nextProps.showFilterResults
                ? this.showFilterData(nextProps)
                : (removeCircle() && this.showQueryData(nextProps));
        }
    }

    /**
     * Remove all the markers and reset markers array.
     */
    clearMarkers() {
        markers.map(function(marker) {
            marker.setMap(null);
            marker = null;
            return true;
        })
        markers = [];
    }

    /**
     * When state.showFilterResults !== true, call this function to show query result.
     * Note that the property 'showFilterResults' decides which function to call.
     * Whenever props update, function 'componentWillReceiveProps()' will be fired and
     * check 'showFilterResults'.
     * @param {*} nextProps 
     */
    showQueryData(nextProps) {
        //Clean screen.
        this.clearMarkers();

        //Validation
        //is data non-empty
        //does query works
        if(nextProps.data.length === 0) {
            nextProps.error
                ? this.setState({snackbarShow: true, message: '获取数据失败！一般是服务器内部原因。'})
                : (nextProps.willEmpty || this.setState({snackbarShow: true, message: '没有符合查询条件的结果。请检查查询条件。'}))
            return false;
        }

        //For every data element, do:
        //1. create a marker representing it.
        //2. add click event listener
        //3. push marker into markers(for filter use)
        nextProps.data.map(function(object) {
            let position = new window.google.maps.LatLng(object.LATITUDE, object.LONGITUDE),
                marker = new window.google.maps.Marker({position: position, map: map});

            //Bind left click event for markers:
            //Event handler: show data details in an InfoWindow.
            marker.addListener('click', function(){
                collisionDetail.setContent(dataToHTML(object));
                collisionDetail.open(map, marker);
            });

            markers.push(marker);
            return true;
        });
    
        //Show tips when data records is more than 400.
        //If data is not empty then markers won't be empty.
        markers.length > 400
            ? this.setState({snackbarShow: true, message: '记录太多了！找到了'+ markers.length + '条记录。请尝试缩小查询范围！'})
            : (nextProps.willEmpty || this.setState({snackbarShow: true, message: '找到了'+ markers.length + '条记录。'}))
        return true;
    }

    /**
     * All the filter operations are based on original query result data.
     * Hence this app doesn't support multiple filter.
     * After once filter, the filter button will be disabled.
     * @param {*} nextProps 
     */
    showFilterData(nextProps) {
        //Validation:
        //is data non-empty
        //is filter option set
        //is circle exists
        console.log('showfilterdata')
        if(nextProps.data.length === 0) {
            this.setState({snackbarShow: true, message: '没有可供过滤的数据。请先进行查询。'});
            this.props.dispatch(cancelFilter());
            return;
        } else if(nextProps.distanceFilterRadius === 0 || !circle) {
            this.setState({snackbarShow: true, message: '没有设置过滤范围。请先标定过滤范围。'});
            this.props.dispatch(cancelFilter());
            return;
        } 

        //Clean screen.
        this.clearMarkers();
        
        //For every data element, do:
        //1. transfer data to position
        //2. judge whether this position is in the circle
        //3. if affirmative to last judge, create a marker.
        //4. add event listener
        //5. push to marker array.
        nextProps.data.map(function(object) {
            let position = new window.google.maps.LatLng(object.LATITUDE, object.LONGITUDE);
            if(circle.contains(position)) {
                var marker = new window.google.maps.Marker({position: position, map: map});
                //Bind left click event for markers:
                //Event handler: show data details in an InfoWindow.
                marker.addListener('click', function(){
                    collisionDetail.setContent(dataToHTML(object));
                    collisionDetail.open(map, marker);
                });
                markers.push(marker);
            }
            return true;
        });

        //Show tips when data records is more than 400.
        if(markers.length > 0) {
            markers.length > 400
                ? this.setState({snackbarShow: true, message: '记录太多了！找到了'+ markers.length + '条记录。请尝试缩小过滤范围！'})
                : (nextProps.willEmpty || this.setState({snackbarShow: true, message: '过滤后还有'+ markers.length + '条记录。'}))
        } else {
            this.setState({snackbarShow: true, message: '没有符合过滤条件的结果。请检查过滤条件。'})
        }
    }

    render(){
        return (
            <div id="map-container">
                {!this.props.isFetching || <LinearProgress style={{position: "fixed", zIndex: "2"}} mode="indeterminate" />} 
                <div id="map" ref="map"></div>
                 <Snackbar
                    open={this.state.snackbarShow}
                    message={this.state.message}
                    autoHideDuration={4000}
                    onRequestClose={() => {this.setState({snackbarShow: false})}}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isFetching: state.isFetching,
        data: state.data,
        error: state.error,
        willEmpty: state.willEmpty,
        distanceFilterRadius: state.distanceFilterRadius,
        showFilterResults: state.showFilterResults
    }
}

export default connect(mapStateToProps)(MapContainer);