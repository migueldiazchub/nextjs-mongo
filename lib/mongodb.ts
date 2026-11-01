import { MongoClient, ObjectId } from "mongodb";

export type Tarea = {
  id: string;
  titulo: string;
  descripcion: string;
};

export const client = new MongoClient(`${process.env.MONGODB_URI}`);
export const db = client.db(`${process.env.MONGODB_DB}`);
export const tareas = db.collection("tareas");

export async function obtenerTareas() {
  await client.connect();

  const cursor = await tareas.find().toArray();
  const lista = new Array<Tarea>();
  for await (const doc of cursor) {
    const tarea: Tarea = {
      id: doc._id.toString(),
      titulo: doc.titulo,
      descripcion: doc.descripcion,
    };
    lista.push(tarea);
  }

  await client.close();

  return lista;
}

export async function insertarTarea(titulo: string, descripcion: string) {
  await client.connect();

  const document = { titulo: titulo, descripcion: descripcion };
  await tareas.insertOne(document);

  await client.close();
}

export async function borrarTarea(id: string) {
  await client.connect();

  const objectId = new ObjectId(id);

  const query = { _id: objectId };
  await tareas.deleteOne(query);

  await client.close();
}

export async function borrarTodo() {
  await client.connect();

  await tareas.deleteMany();

  await client.close();
}
