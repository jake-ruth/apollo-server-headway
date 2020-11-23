const { ApolloServer, gql } = require("apollo-server");
const { Sequelize } = require("sequelize");

// Option 2: Passing parameters separately (sqlite)
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "paths/to/database.sqlite"
});

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: (root, args, context) => "Hello world!"
    // hello2: (root, args, context) => "Whatup world!"
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then(async ({ url }) => {
  console.log(`🚀 Server ready at ${url}`);

  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
