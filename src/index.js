import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import ProposalContainer from './containers/proposal'
import DaoContainer from './containers/dao'
import UserContainer from './containers/user-profile'
import PayProposalContainer from './containers/pay-proposal'
import PayConfirmedProposalContainer from './containers/pay-confirmed-proposal'
import NewProposalContainer from './containers/new-proposal'
import NewDaoContainer from './containers/new-dao'
import ProposalSwimLanesContainer from './containers/proposal-swim-lanes'
import DaosContainer from './containers/daos'
import Error404Container from './containers/404'
import registerServiceWorker from './registerServiceWorker'
import store from './store'
import { Provider } from 'react-redux'
import CallbackContainer from './containers/callback';

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route path="/proposals/new" component={NewProposalContainer} />
        <Route path="/proposals/:id/pay" component={PayProposalContainer} />
        <Route path="/proposals/:id/payconfirmed" 
          component={PayConfirmedProposalContainer} />
        <Route path="/proposals/:id" component={ProposalContainer} />
        <Route path="/proposals" component={ProposalSwimLanesContainer} />
        <Route path="/daos/new" component={NewDaoContainer} />
        <Route path="/daos/:id" component={DaoContainer} />
        <Route path="/daos" component={DaosContainer} />
        <Route path="/users/:email" component={UserContainer} />
        <Route path="/callback" component={CallbackContainer}/>
        <Route path="/" exact component={ProposalSwimLanesContainer} />
        <Route component={Error404Container} />
      </Switch>
    </Router>
  </Provider>, 
  document.getElementById('root')
)
registerServiceWorker()
