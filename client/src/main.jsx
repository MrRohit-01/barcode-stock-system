import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import App from "./App";
import "./index.css";
import "@mantine/core/styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <MantineProvider withNormalizeCSS withGlobalStyles>
    <App />
  </MantineProvider>
);
