import "./App.css";
import { SkynetProvider } from "./state/SkynetContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import React from "react";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Blog from "./pages/Blog";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#00C65E",
    },
    secondary: {
      dark: "#0D0D0D",
      main: "#EBEFEE",
    },
  },
});
const themeDark = createTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#00C65E",
    },
    secondary: {
      dark: "#0D0D0D",
      main: "#EBEFEE",
    },
  },
});

const currentTheme = theme;

function App() {
  return (
    <SkynetProvider>
      <ThemeProvider theme={currentTheme}>
        <Router>
          <NavigationBar />
          <Switch>
            <Route path={"/create"}>
              <Create />
            </Route>
            <Route path={"/blog"}>
              <Blog />
            </Route>
            <Route path={"/"}>
              <Home />
            </Route>
          </Switch>
        </Router>
      </ThemeProvider>
    </SkynetProvider>
  );
}

export default App;
