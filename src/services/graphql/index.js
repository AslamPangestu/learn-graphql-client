import { ApolloClient, InMemoryCache } from "@apollo/client";

const URI = process.env.REACT_APP_URI || 'http://localhost:4000/';
const client = new ApolloClient({
    uri: URI,
    cache: new InMemoryCache()
});

export default client

export {default as books} from './books'