import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ShortenerPage from './ShortenerPage';
import StatisticsPage from './StatisticsPage';
import { Container } from '@mui/material';

function App() {
  return (
    <Router>
      <Container>
        <Switch>
          <Route path="/stats" component={StatisticsPage} />
          <Route path="/" component={ShortenerPage} />
        </Switch>
      </Container>
    </Router>
  );
}

export default App;