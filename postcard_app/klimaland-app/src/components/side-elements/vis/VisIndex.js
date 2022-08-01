//https://stackoverflow.com/questions/48268507/react-dynamically-import-components

let Vis = {};

Vis['EnPrimaryEnergy'] = require('./EnPrimaryEnergy').default;
Vis['MoCarDensity'] = require('./MoCarDensity').default;
Vis['PlaceHolder'] = require('./PlaceHolder').default;

export default Vis