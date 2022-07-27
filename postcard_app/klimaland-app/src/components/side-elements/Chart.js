import React, { Component } from 'react'

import LineChart from '../vis/LineChart.js'



export default class Chart extends Component {
    constructor(props){
        super(props)

        //TODO: load data here once, but it needs to work with the async stuff in the child components
        //TODO: store range or max Val in data as well

        this.state = {
            fill: '#FFE8C9',
            stroke: '#bbb',
            localData:[]
        }
    }

    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve);
        });
    }

    async componentDidMount(){
        await this.setStateAsync({localData:Data[this.props.lk.value]})
        console.log("mount done")
    }

    //TODO: smarter way of drawing viz (from layout-controls!)
    render() {
        return(
            <div className={"chart-container " + this.props.thumbnailClass}>
                <h3>Grüsse aus {this.props.lk.label}, mit der id {this.props.lk.value}!</h3>
                {this.props.section == "Mo" && this.props.activeSide == 0 && 
                    <LineChart localData={this.props.localData}
                    width={this.props.chartStyle.width} 
                    height={this.props.chartStyle.height}
                    thumbnailClass={this.props.thumbnailClass}
                    section={this.props.section}/>} 
                {this.props.section != "Mo" && 
                    <svg width={this.props.chartStyle.width} height={this.props.chartStyle.height}>
                        <rect width={this.props.chartStyle.width} height={this.props.chartStyle.height} style={{fill:this.state.fill,strokeWidth:3,stroke:this.state.stroke}} />
                    </svg>}
                <p>Hier ist ein Chart über die Section {this.props.section}. Seite {this.props.activeSide}. </p>     
            </div>
        )
    }
}

