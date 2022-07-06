import logofront from "../data/images/logo.svg";

const Front = () => {
  return (
    <div className="front">
      <h4>Front</h4>
      <img
        src={logofront}
        className="header-taz"
        alt="header-taz"
        width="80%"
      />
    </div>
  );
};

export default Front;
