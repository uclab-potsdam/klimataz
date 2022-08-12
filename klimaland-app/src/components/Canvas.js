import LayoutManager from "./LayoutManager";

const Canvas = () => {
  

  // get parameters from iframe
  let getParamValue = function(paramName)
  {
      var url = window.location.search.substring(1); //get rid of "?" in querystring
      var qArray = url.split('&'); //get key-value pairs
      for (var i = 0; i < qArray.length; i++) 
      {
          var pArr = qArray[i].split('='); //split key and value
          if (pArr[0] === paramName) 
            //  console.log(pArr[1]);
              return pArr[1]; //return value
      }
  }
  
  let areaPick1 = getParamValue('param1');
  let areaPick2 = getParamValue('param2');
  let areaPick3 = getParamValue('param3');

  return (
    <div className="indicators-iframe">
      {/* <h1>Climate Protection Indicators</h1> */}
      <LayoutManager areaPick1={areaPick1} areaPick2={areaPick2} areaPick3={areaPick3} />
    </div>
  );
};

export default Canvas;
