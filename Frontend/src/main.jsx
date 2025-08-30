import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import CentralStore from "../MainCentralState/CentralState.jsx";
createRoot(document.getElementById("root")).render(
  <Provider store={CentralStore}>
    <BrowserRouter>
      <StrictMode>
        <App />
      </StrictMode>
    </BrowserRouter>
  </Provider>
);
