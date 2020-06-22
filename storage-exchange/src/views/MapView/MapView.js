import React, { Component, Fragment } from 'react';
import locationpin from '../../Assets/Img/location-icon.png';
import PropTypes from "prop-types";
import './MapView.css'
import { getFormattedInt } from "../../Utils/utils";
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
    InfoWindow
} from "react-google-maps";
import { CONFIG } from '../../Utils/config';
import feature_home from './../../Assets/Img/ventor-list.png';

export default class MapView extends Component {

    static defaultProps = {
        googleMapURL: 'https://maps.googleapis.com/maps/api/js?key=' + CONFIG.GoogleMapsApiKey + '',
        StoreDetails: [],
        center: {
            lat: 39.8283,
            lng: -98.5795
        },
        zoom: 4
    }

    constructor(props) {
        super(props);
        this.state = {
            selectedMarker: {
                StoreID: '',
                StoreName: '',
                StoreImage: '',
                StorePrice: ''
            },
            showInfoWindow: false

        }
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.onMarkerClose = this.onMarkerClose.bind(this);
    }


    componentDidMount() {

        this.delayedShowMarker()
    }

    CMap = withScriptjs(withGoogleMap(props =>
        <GoogleMap
            //defaultZoom={9}
            defaultZoom={this.props.zoom}
            defaultCenter={{ lat: parseFloat(this.props.center.lat), lng: parseFloat(this.props.center.lng) }}
            FdefaultOptions={{ zoomControl: true, fullscreenControl: true, streetViewControl: true, disableDefaultUI: true, mapTypeControl: false }}
        >
            {props.children}
        </GoogleMap>
    ));

    delayedShowMarker = () => {
        setTimeout(() => {
            this.setState({ isMarkerShown: true })
        }, 3000)
    }

    handleMarkerClick = () => {
        this.setState({ isMarkerShown: false })
        this.delayedShowMarker()
    }

    onMarkerClick = (store) => {
        var selectedMarker = this.state.selectedMarker;
        selectedMarker.StoreID = store.StoreID;
        selectedMarker.StoreName = store.StoreName;
        selectedMarker.StoreImage = store.StoreImage;
        selectedMarker.StorePrice = store.Price;

        this.setState({ showInfoWindow: true, selectedMarker: selectedMarker });
    }

    onMarkerClose() {
        this.setState({ showInfoWindow: false });
    }

    render() {
        const { StoreDetails, googleMapURL } = this.props;
        const { selectedMarker, showInfoWindow } = this.state;
        return (
            <Fragment>
                <this.CMap
                    googleMapURL={googleMapURL}
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `90%` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                >
                    {StoreDetails.map((store, index) => {
                        return (
                            <Marker
                                position={{ lat: parseFloat(store.Latitude), lng: parseFloat(store.Longitude) }}
                                onMouseOver={() => this.onMarkerClick(store)}
                                icon={locationpin}
                            >
                                {showInfoWindow && selectedMarker.StoreID === store.StoreID ?
                                    <InfoWindow
                                        onCloseClick={() => this.onMarkerClose()}
                                        visible={showInfoWindow}>
                                        <div className="gmap-tooltip map-view">
                                            {selectedMarker.StoreImage != null ?
                                                <img src={'/StoreImages/' + selectedMarker.StoreImage} onError={(e) => { e.target.onerror = null; e.target.src = feature_home }} alt="img" /> :
                                                <img src={feature_home} alt="" />}
                                            <h5>{selectedMarker.StoreName}</h5>
                                            <h6> ${getFormattedInt(selectedMarker.StorePrice)}</h6>
                                        </div>
                                    </InfoWindow>
                                    : ''}
                            </Marker>
                        )
                    })}
                </this.CMap>
            </Fragment>
        )
    }
}
