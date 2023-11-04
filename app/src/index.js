import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";

import { AppContextProvider } from "./contexts/app.context";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AppContextProvider>
    <BrowserRouter>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <App />
      </SnackbarProvider>
    </BrowserRouter>
  </AppContextProvider>
);

reportWebVitals();
