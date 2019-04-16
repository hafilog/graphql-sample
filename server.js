const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

// スキーマ
const typeDefs = gql`
  type Query {
    shops: [Shop]
  }

  type Shop {
    name: String!,
    main: String!
  }
`;

// ダミーデータ
const shops = [
  {
    name: 'mcdonalds',
    main: 'humberger'
  },
  {
    name: 'starbucks',
    main: 'coffee'
  }
]

// リゾルバー
const resolvers = {
  Query: {
    shops: () => shops
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
