import "./App.css";
import { SkynetProvider } from "./state/SkynetContext";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import React from "react";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Blog from "./pages/Blog";
import Profile from "./pages/Profile";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";

//app theme colors for default light theme
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
//app theme colors for dark mode
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
            <Route path={"/profile/:id"}>
              <Profile />
            </Route>
            <Route path={"/:ref/:dac/:domain/:posts/:file/:id"}>
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
