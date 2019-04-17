const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

// スキーマ
const typeDefs = gql`
  type Query {
    shops: [Shop],
    shop(name: String!): Shop
  }

  type Mutation {
    update(name: String!, newMain: String!): [Shop]
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
    shops: () => shops,
    shop: (obj, args, context, info) => {
      const { name } = args
      return shops.find(_shop => _shop.name === name)
    }
  },
  Mutation: {
    update: (obj, args, context, info) => {
      const { name, newMain } = args
      shops.forEach(_shop => {
        if (_shop.name === name) {
          // 値を更新
          _shop.main = newMain
        }
      })
      return shops
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
