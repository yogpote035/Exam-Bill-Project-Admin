import "./App.css";
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<h1 className="text-9xl text-cyan-500 text-center">Hello</h1>}
        />
      </Routes>
    </>
  );
}

export default App;
