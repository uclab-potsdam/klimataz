import React, { Component } from 'react'

export default class Chart extends Component {
    constructor(props){
        super(props)

        this.state = {
            fill: '#FFE8C9',
            stroke: '#bbb'
        }
    }

    render() {
        return(
            <div className={"chart-container " + this.props.thumbnailClass}>
                <h3>Grüsse aus {this.props.lk.label}, mit der id {this.props.lk.value}!</h3>
                <svg width={this.props.chartStyle.width} height={this.props.chartStyle.height}>
                    <rect width={this.props.chartStyle.width} height={this.props.chartStyle.height} style={{fill:this.state.fill,strokeWidth:3,stroke:this.state.stroke}} />
                </svg>
                <p>Hier ist ein Chart über die Section {this.props.section}. Seite {this.props.activeSide}. </p>     
            </div>
        )
    }
}

