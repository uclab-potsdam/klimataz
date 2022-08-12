import "./App.css";
import Navbar from "./components/Navbar";
import Canvas from "./components/Canvas";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Navbar />
        <h1>Hello</h1>
        <Canvas />
      </header>
    </div>
  );
}

export default App;
