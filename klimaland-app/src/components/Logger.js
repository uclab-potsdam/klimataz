import { Component } from 'react';
import axios from 'axios';

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

// helper functions
const sendPackage = function (type) {
    axios
        .post(data.instrumentationUrl, {
            id: data.id,
            num: data.packageCounter,
            type,
            data
        })
        .then(function (response) { })
        .catch(function (error) {
            console.log(error)
        })
    data.packageCounter++
}

const getWindowSize = function () {
    return {
        x: window.innerWidth,
        y: window.innerHeight
    }
}

// server communication
const sendInitialLog = function () {
    const data = {
        windowSize: getWindowSize()
    }

    sendPackage(data.packageType.init, data)
}

const initLogging = function () {
    data.id = Date.now()
    sendInitialLog()
}

const logEvent = function (type) {
    const eventData = {
        timeOffset: Date.now() - data.id,
        type,
        data
    }
    data.eventStack.push(eventData)
}

// loggers
const getDeviceOS = function () {
    return navigator.oscpu
}

const getDeviceBrowser = function () {
    return navigator.appCodeName + '' + navigator.appVersion
}

const getUserClick = function (event) {
    let eventDoc, doc, body
    event = event || window.event
    // Same logic from below.
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
    // returning also target div to know where the click occurred.
    return {
        x: event.pageX,
        y: event.pageY,
        target: event.target.classList.length !== 0
            ? event.target.classList
            : event.target
    }
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
    console.log('!')
    return {
        x: event.pageX,
        y: event.pageY
    }
}

//event handlers
const handleMouseMove = function (event) {
    logEvent(data.eventType.mouseMove, getUserMousePos())
}

const handleClick = function (event) {
    logEvent(data.eventType.Click, getUserClick())

    if ('ontouchstart' in window) {
        document.addEventListener('touchstart', (e) => {
            logEvent(data.eventType.Click, getUserClick())
        })
    }
}

const handleDeviceOS = function () {
    logEvent(data.eventType.deviceOS, getDeviceOS())
}

const handleDeviceBrowser = function () {
    logEvent(data.eventType.deviceBrowser, getDeviceBrowser())
}
export default class Logger extends Component {

    componentDidMount() {
        handleDeviceOS()
        handleDeviceBrowser()
        document.onclick = handleClick
        document.onmousemove = handleMouseMove
        document.ontouchstart = handleClick
    }

    render() {
        return (<div></div>)
    }
}

