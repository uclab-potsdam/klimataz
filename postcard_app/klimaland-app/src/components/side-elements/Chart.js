import React, { Component } from 'react'


export default class Chart extends Component {
    constructor(props){
        super(props)
    }

    render() {
        return(
            <div className="chart-container">
                <h3>Grüsse aus {this.props.lk.label}, mit der id {this.props.lk.value}!</h3>
                <h4>Hier ist ein Chart über die Section {this.props.section}.</h4>
                <p>Seite {this.props.activeSide}</p>        
            </div>
        )
    }
}

