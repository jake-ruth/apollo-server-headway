const { ApolloServer, gql } = require("apollo-server");
const { Sequelize } = require("sequelize");

// Option 2: Passing parameters separately (sqlite)
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite"
});

//const User = sequelize.import("models/user")(sequelize, Sequelize);
const models = require("./models"); //path of models folder
const User = models.User;

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
    hello2: String
    readAllTest: [User]
  }
  type Mutation {
    insertTest: User
  }
  type User {
    firstName: String
    lastName: String
    email: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: (root, args, context) => "Hello world!",
    hello2: (root, args, context) => "Whatup world!",
    readAllTest: async (root, args, context) => {
      const allUsers = await User.findAll();

      return allUsers;
    }
  },
  Mutation: {
    insertTest: async (root, args, context) => {
      await sequelize.sync();
      const jane = await User.create({
        firstName: "Jimmy",
        lastName: "Doe"
      });
      console.log("auto-generated ID:", jane.id);
    }
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
