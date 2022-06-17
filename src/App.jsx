import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { NonAuthRoute, AuthRoute, Head } from 'components';
import { SignIn, SignUp, Home, Settings, Meetings, SearchResults, Help, MeetingDetail, MyActionItems } from 'pages';
import { StateProvider } from 'state';
import { HelmetProvider } from 'react-helmet-async';
import { stripe } from 'utils';
import { Elements } from '@stripe/react-stripe-js';
import { PATHNAME } from 'utils/constants';
import { SearchProvider } from 'providers/searchContext';
import 'utils/firebase';
import 'assets/scss/global.scss';

const App = () => (
  <HelmetProvider>
    <Elements stripe={stripe}>
      <StateProvider>
        <Head />
        <SearchProvider>
          <Router>
            <Switch>
              {/* <AuthRoute path={PATHNAME.HOME} exact component={secretpage} role="premium"/> */}
              <AuthRoute path={PATHNAME.HOME} exact component={Home} />
              <AuthRoute path={PATHNAME.SETTINGS} exact component={Settings} />
              <AuthRoute path={PATHNAME.MEETINGS} exact component={Meetings} />
              <AuthRoute path={`${PATHNAME.MEETING}/:id`} exact component={MeetingDetail} noRecorder />
              <AuthRoute path={PATHNAME.SEARCH_RESULTS} exact component={SearchResults} />
              <AuthRoute path={PATHNAME.MY_ACTION_ITEMS} exact component={MyActionItems} />
              <AuthRoute path={PATHNAME.HELP} exact component={Help} />

              <NonAuthRoute path={PATHNAME.SIGN_IN} exact component={SignIn} />
              <NonAuthRoute path={PATHNAME.SIGN_UP} exact component={SignUp} />
            </Switch>
          </Router>
        </SearchProvider>
      </StateProvider>
    </Elements>
  </HelmetProvider >
);

export default App;
