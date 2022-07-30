const TitleCanvas = ({ landkreis }) => {
  return (
    <div className="canvasTitle">
      <div className="lkTitle">
        <div className="greetz">
          Herzliche <br></br>Grüße aus
        </div>
        {landkreis[0].label}
      </div>
    </div>
  );
};

export default TitleCanvas;
