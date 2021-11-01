import "./App.css";
import { SkynetProvider } from "./state/SkynetContext";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import React from "react";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Blog from "./pages/Blog";
import Profile from "./pages/Profile";
import Footer from "./components/Footer";
import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from "@material-ui/core/styles";
import "@fontsource/sora";
import ScrollToTop from "./components/ScrollToTop";

//app theme colors for default light theme
let theme = createTheme({
  palette: {
    primary: {
      main: "#00C65E",
    },
    secondary: {
      dark: "#0D0D0D",
      main: "#EBEFEE",
    },
  },
  typography: {
    fontFamily: "Sora",
  },
});
theme = responsiveFontSizes(theme);

//app theme colors for dark mode
// const themeDark = createTheme({
//   palette: {
//     type: "dark",
//     primary: {
//       main: "#00C65E",
//     },
//     secondary: {
//       dark: "#0D0D0D",
//       main: "#EBEFEE",
//     },
//   },
// });

const currentTheme = theme; //set theme to const for MVP

function App() {
  return (
    <SkynetProvider>
      <ThemeProvider theme={currentTheme}>
        <Router>
          <ScrollToTop />
          <NavigationBar />
          <Switch>
            <Route path={"/create"}>
              <Create />
            </Route>
            <Route
              path={"/profile/:id"}
              render={({ match }) => <Profile key={match.params.id} />}
            />
            <Route path={"/:ref/:dac/:domain/:posts/:file/:id"}>
              <Blog />
            </Route>
            <Route path={"/"}>
              <Home />
            </Route>
          </Switch>
          <Footer />
        </Router>
      </ThemeProvider>
    </SkynetProvider>
  );
}

export default App;
