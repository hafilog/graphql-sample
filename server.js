const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

// スキーマ
const typeDefs = gql`
  type Query {
    shops: [Shop],
    shop(name: String!): Shop,
    searchByName(q: String!): [SearchResult]
  }

  type Mutation {
    update(name: String!, newMain: String!): [Shop],
    create(name: String!, main: String!): [Shop],
    delete(name: String!): [Shop]
  }

  type Shop {
    name: String!,
    main: String!,
    foods: [Food]
  }

  type Food {
    name: String!,
    price: Int!
  }

  union SearchResult = Shop | Food
`;

// ダミーデータ
const shops = [
  {
    name: 'mcdonalds',
    main: 'humberger',
    foods: [
      {
        name: 'potato',
        price: 200
      },
      {
        name: 'chickenNugget',
        price: 300
      }
    ]
  },
  {
    name: 'starbucks',
    main: 'coffee',
    foods: [
      {
        name: 'sandwich',
        price: 500
      }
    ]
  }
]

// リゾルバー
const resolvers = {
  Query: {
    shops: () => shops,
    shop: (obj, args, context, info) => {
      const { name } = args
      return shops.find(_shop => _shop.name === name)
    },
    searchByName: (obj, args, context, info) => {
      const { q } = args
      const results = []
      shops.forEach(_shop => {
        if (_shop.name.includes(q)) {
          results.push(_shop)
        }
        _shop.foods.forEach(_food => {
          if (_food.name.includes(q)) {
            results.push(_food)
          }
        })
      })
      return results
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
    },
    create: (obj, args, context, info) => {
      const { name, main } = args
      shops.push({ name, main })
      return shops
    },
    delete: (obj, args, context, info) => {
      const { name } = args
      return shops.filter(_shop => _shop.name !== name)
    }
  },
  SearchResult: {
    __resolveType(obj, context, info){
      if (obj.main) {
        return 'Shop'
      }
      if (obj.price) {
        return 'Food'
      }
      return null
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
