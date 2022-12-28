import React from 'react';
import {ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';
import SpaceXLaunchList from './components/SpaceXLaunchList';

const client = new ApolloClient({
  uri: 'https://api.spacex.land/graphql/',
  cache: new InMemoryCache(),
  defaultOptions: {watchQuery: {fetchPolicy: 'cache-and-network'}},
});

function App(props) {
  return (
    <ApolloProvider client={client}>
      <SpaceXLaunchList />
    </ApolloProvider>
  );
}

export default App;
