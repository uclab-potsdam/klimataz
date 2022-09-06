//https://stackoverflow.com/questions/48268507/react-dynamically-import-components

let Vis = {};

Vis['EnPrimaryEnergy'] = require('./vis/EnPrimaryEnergy.js').default;
Vis['EnIndustry'] = require('./vis/EnIndustry.js').default;
Vis['MoCarDensity'] = require('./vis/MoCarDensity.js').default;
Vis['MoModalSplit'] = require('./vis/MoModalSplit.js').default;
Vis['AbBiotonneWeight'] = require('./vis/AbBiotonneWeight.js').default;
Vis['LaAnimalCount'] = require('./vis/LaAnimalCount.js').default;
Vis['GeNewBuildings'] = require('./vis/GeNewBuildings.js').default;
Vis['GeAvgHeating'] = require('./vis/GeAvgHeating.js').default;

export default Vis