import { ApolloClient, InMemoryCache, createHttpLink, ApolloProvider } from '@apollo/client';
import UserPage from './pages/UserPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Header from './components/Header';
import Footer from './components/Footer';
import Cohort from './pages/Cohort';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { setContext } from '@apollo/client/link/context';
import Splash from './pages/Splash';
import TestPage from './pages/TestPage';
import UpdateUser from './pages/UpdateUser';

// Construct our main GraphQL API endpoint
const httpLink = createHttpLink({
  // uri: 'https://awesome-gql-backend.herokuapp.com/graphql', // deployed database
  uri: '/graphql', // local db
});


// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {

  return (
    <ApolloProvider client={client}>
      <Header />
      <div className="App container" style={{ minHeight: '90vh', overflowX: 'hide' }}>
        <Router>
          <Switch>

            {/* <Route exact path="/">
              <Splash />
            </Route> */}

            <Route exact path={["/users/:id", "/me"]}>
              <UserPage />
            </Route>

            <Route exact path="/cohorts/:id">
              <Cohort />
            </Route>

            <Route exact path="/login">
              <Login />
            </Route>

            <Route exact path="/signup">
              <Signup />
            </Route>

            <Route exact path="/testingtesting">
              <TestPage />
            </Route>

            <Route exact path="/updateuser">
              <UpdateUser />
            </Route>


            <Route exact path="*">
              <h1>404 not found</h1>
            </Route>

          </Switch>
        </Router>
      </div>
      <Footer />
    </ApolloProvider>
  );
}

export default App;
