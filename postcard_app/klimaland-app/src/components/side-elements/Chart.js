import React, { Component } from 'react'
import VisIndex from './VisIndex';

export default class Chart extends Component {
    // constructor(props) {
    //     super(props)

    //     //TODO: store range or max Val in data as well
    //     //TODO: reusable code snippets like scales or axis
    // }

    //TODO: smarter way of drawing viz (from layout-controls!)
    render() {

        //get component name from data and import component
        let chartComponent = this.props.layoutControls[this.props.activeSide][0].components.component
        const RenderChart = VisIndex[chartComponent];

        console.log(this.props)

        return (
            <div className="chart-container">
                <svg
                    width="100%"
                    height="100%"
                    className={"svg-container " + this.props.section + "-chart"}
                >
                    <RenderChart {...this.props} />
                </svg>
            </div>
        )
    }
}

