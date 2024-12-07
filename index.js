import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import Knex from "knex";

const knex = Knex({
  client: "mysql",
  connection: {
    host: process.env["MY_HOST"],
    port: process.env["MY_PORT"],
    user: process.env["MY_USER"],
    password: process.env["MY_PWD"],
    database: process.env["MY_DB"],
  },
});

const typeDefs = `
  type Student {
    id_estudiante: ID! 
    nombre: String!
    apellido_pat: String!
    apellido_mat: String!
  }
  
  type Query {
    student(id: ID): Student
    hello: String
  }
`;

const resolvers = {
  Query: {
    student: (parent, args, context, info) => {
      return knex("Estudiante")
        .where({
          id_estudiante: args.id,
        })
        .select()
        .first();
    },
    hello: () => "Hello world!",
  },
};

async function startApolloServer() {
  const app = express();

  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();

  app.use("/graphql", cors(), express.json(), expressMiddleware(server));

  app.listen(3000, () => {
    console.log(" Server ready at http://localhost:3000{server.graphqlPath}");
  });
}

startApolloServer();
