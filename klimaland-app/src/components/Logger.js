import { Component } from 'react';
import axios from 'axios';

const initialData = {
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
    hostUrl: 'https://uclab.fh-potsdam.de',
    instrumentationUrl: '/klimaland/log.php'
}

// helper functions
const sendPackage = function (type, data) {
    axios
        .post(initialData.instrumentationUrl, {
            id: initialData.id,
            num: initialData.packageCounter,
            type,
            data
        })
        .then(function (response) { })
        .catch(function (error) {
            console.log(error)
        })
    initialData.packageCounter++
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
        deviceOS: getDeviceOS(),
        deviceBrowser: getDeviceBrowser(),
        windowSize: getWindowSize()
    }
    // console.log(data)
    sendPackage(initialData.packageType.init, data)
}

const sendLog = function () {
    if (initialData.eventStack.length > 0) {
        const data = initialData.eventStack
        initialData.eventStack = []
        sendPackage(initialData.packageType.stack, data)
    }
}

const initLogging = function () {
    initialData.id = Date.now()
    sendInitialLog()
    window.setInterval(sendLog, 5000)
}

const logEvent = function (type, data) {
    const eventData = {
        timeOffset: Date.now() - initialData.id,
        type,
        data
    }
    // console.log('logging event', eventD)
    initialData.eventStack.push(eventData)
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
        target: event.target.classList[0]
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
    return {
        x: event.pageX,
        y: event.pageY
    }
}

//event handlers
const handleMouseMove = function (event) {
    logEvent(initialData.eventType.mouseMove, getUserMousePos())
}

const handleClick = function (event) {
    logEvent(initialData.eventType.Click, getUserClick())

    if ('ontouchstart' in window) {
        document.addEventListener('touchstart', (e) => {
            logEvent(initialData.eventType.Click, getUserClick())
        })
    }
}

const handleDeviceOS = function () {
    logEvent(initialData.eventType.deviceOS, getDeviceOS())
}

const handleDeviceBrowser = function () {
    logEvent(initialData.eventType.deviceBrowser, getDeviceBrowser())
}
export default class Logger extends Component {

    componentDidMount() {
        // if (window.location.href.includes(data.hostUrl)) {
        handleDeviceOS()
        handleDeviceBrowser()
        document.onclick = handleClick
        document.onmousemove = handleMouseMove
        document.ontouchstart = handleClick
        initLogging()
        // } else {
        //     console.log('logging not active')
        // }
    }

    render() {
        return (<div></div>)
    }
}

