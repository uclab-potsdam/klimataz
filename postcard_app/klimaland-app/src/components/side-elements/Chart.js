import React, { Component } from 'react'

export default class Chart extends Component {
    constructor(props) {
        super(props)

        //TODO: store range or max Val in data as well
    }

    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve);
        });
    }


    //TODO: smarter way of drawing viz (from layout-controls!)
    render() {
        return (
            <div className={"chart-container " + this.props.thumbnailClass}>
                <h3>Grüsse aus {this.props.lk.label}, mit der id {this.props.lk.value}!</h3>
                {this.props.children}
                {/* {this.props.section == "Mo" && this.props.children}
                {this.props.section == "En" && this.props.children}
                {this.props.section != "Mo" && this.props.section != "En" &&
                    <svg width={this.props.chartStyle.width} height={this.props.chartStyle.height}>
                        <rect width={this.props.chartStyle.width}
                            height={this.props.chartStyle.height}
                            style={{ fill: this.state.fill, strokeWidth: 3, stroke: this.state.stroke }} />
                        <text
                            y={this.props.chartStyle.height / 2} >
                            Placeholder for Chart
                        </text>
                    </svg>} */}
                <p>Hier ist ein Chart über die Section {this.props.section}. Seite {this.props.activeSide}. </p>
            </div>
        )
    }
}

