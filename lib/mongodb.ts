import { MongoClient } from "mongodb";

// const uri = `${process.env.MONGODB_URI}`;

export async function abrirConexion() {
  const client = new MongoClient(`${process.env.MONGODB_URI}`);
  return client;
}
