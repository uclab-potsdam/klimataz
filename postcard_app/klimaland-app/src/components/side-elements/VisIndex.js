//https://stackoverflow.com/questions/48268507/react-dynamically-import-components

let Vis = {};

Vis['EnPrimaryEnergy'] = require('./vis/Energy.js').default;
Vis['MoCarDensity'] = require('./vis/Mobility.js').default;
Vis['Waste'] = require('./vis/Waste.js').default;

export default Vis