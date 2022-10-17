import { Component } from 'react';

const data = {
    id: 0,
    eventType: {
        Click: 10,
        mouseMove: 20,
        deviceOS: 30,
        deviceBrowser: 40
    },
    packageType: {
        init: 10,
        stack: 20
    },
    packageCounter: 0,
    eventStack: [],
    // Edit to localhost if you are debugging
    hostUrl: 'http://localhost:3000/',
    instrumentationUrl: '/side-elements/log/log.php'
}

// loggers
const getDeviceOS = function () {
    return navigator.oscpu
}

const getDeviceBrowser = function () {
    return navigator.appCodeName + '' + navigator.appVersion
}

const getUserClick = function () {

}

const getUserMousePos = function (event) {
    let eventDoc, doc, body
    event = event || window.event // IE-ism
    // If pageX/Y aren't available and clientX/Y are,
    // calculate pageX/Y - logic taken from jQuery.
    // (This is to support old IE)
    if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document
        doc = eventDoc.documentElement
        body = eventDoc.body
        event.pageX =
            event.clientX +
            ((doc && doc.scrollLeft) || (body && body.scrollLeft) || 0) -
            ((doc && doc.clientLeft) || (body && body.clientLeft) || 0)
        event.pageY =
            event.clientY +
            ((doc && doc.scrollTop) || (body && body.scrollTop) || 0) -
            ((doc && doc.clientTop) || (body && body.clientTop) || 0)
    }
    // Use event.pageX / event.pageY here
    return {
        x: event.pageX,
        y: event.pageY
    }
}

export default class Logger extends Component {

    componentDidMount() {
        console.log('logger component is mounted')
        getDeviceOS()
        getDeviceBrowser()
        document.addEventListener('mousemove', (e) => {
            getUserMousePos(e)
        });
    }


    // console.log('logger component is mounted')
    render() {
        return (<div></div>)
    }
}

