import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./globalStyles/index.scss";

const container = document.getElementById("root");
if (!container) {
    // TODO (xavier-charles):: Replace with a proper logger
    throw new Error("Root element not found");
}

ReactDOM.createRoot(container).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
