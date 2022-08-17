//https://stackoverflow.com/questions/48268507/react-dynamically-import-components

let Vis = {};

Vis['EnPrimaryEnergy'] = require('./vis/Energy.js').default;
Vis['MoCarDensity'] = require('./vis/MoCarDensity.js').default;
Vis['Waste'] = require('./vis/Waste.js').default;
Vis['LaAnimalCount'] = require('./vis/LaAnimalCount.js').default;
Vis['Buildings'] = require('./vis/Buildings.js').default;

export default Vis