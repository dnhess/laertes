import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core'
import './App.css';
// Color theme
// materialpalette.com/green/amber
// Components
import Navbar from './components/Navbar'
// Pages
import Home from './pages/home'
import login from './pages/login'
import signup from './pages/signup'

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#C8E6C9',
      main: '#4CAF50',
      dark: '#388E3C',
      contrastText: '#FFFFFF'
    },
    accent: '#FFC107',
    secondary: {
      main: '#FFC107',
    },
    ptext: '#212121', // Primary Text Color
    stext: '#757575', // Secondary Text Color
    divider: '#BDBDBD'
  }
})

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <div className="App">
        <Router>
        <Navbar />
          <div className="container">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={login} />
              <Route exact path="/signup" component={signup} />
            </Switch>
          </div>
        </Router>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
