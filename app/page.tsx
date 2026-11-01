import { revalidatePath } from "next/cache";
import {
  insertarTarea,
  obtenerTareas,
  borrarTarea,
  borrarTodo,
} from "@/lib/mongodb";

export default async function Page() {
  const tareas = await obtenerTareas();

  async function crearTarea(formData: FormData) {
    "use server";

    const titulo = formData.get("titulo");
    const descripcion = formData.get("descripcion");

    if (typeof titulo !== "string" || typeof descripcion !== "string") {
      return;
    }

    if (titulo.trim() === "" || descripcion.trim() === "") {
      return;
    }

    await insertarTarea(titulo.trim(), descripcion.trim());

    revalidatePath("/");
  }

  async function eliminarTarea(formData: FormData) {
    "use server";

    // await borrarTodo();

    const id = formData.get("id") as string;

    await borrarTarea(id);

    revalidatePath("/");
  }

  return (
    <div className="text-gray-100">
      <header className="h-[15vh] text-center content-center bg-gray-900">
        <h1 className="text-5xl font-semibold">Gestor de Tareas React</h1>
      </header>
      <main className="h-[85vh] pt-[5vh] flex justify-center gap-10 bg-gray-600">
        <form
          action={crearTarea}
          className="h-1/2 w-1/3 pb-5 border rounded-sm flex flex-col justify-between items-center bg-gray-500"
        >
          <h2 className="w-full h-20 text-3xl rounded-t-sm text-center content-center bg-gray-700">
            <strong>Formulario</strong>
          </h2>
          <div className="w-2/3 h-1/3 flex flex-col justify-between">
            <input
              className="pl-2 border rounded-md bg-gray-200 text-gray-800 placeholder:text-gray-400"
              name="titulo"
              placeholder="Título de la tarea"
            ></input>
            <textarea
              className="h-2/3 pl-2 border rounded-md resize-none bg-gray-200 text-gray-800 placeholder:text-gray-400"
              name="descripcion"
              placeholder="Descripción de la tarea"
            ></textarea>
          </div>
          <button
            className="w-50 h-1/6 rounded-sm bg-gray-600 text-gray-100 hover:bg-gray-400 hover:text-gray-800"
            type="submit"
          >
            Añadir
          </button>
        </form>
        <div className="border h-4/5 w-1/3 rounded-sm overflow-auto bg-gray-500">
          <h2 className="w-full h-20 rounded-t-sm text-3xl text-center content-center bg-gray-700">
            <strong>Tareas</strong>
          </h2>
          {tareas.length === 0 ? (
            <p className="text-center text-xl">No hay tareas</p>
          ) : (
            <div className="flex flex-col p-2 gap-2">
              {tareas.map((tarea) => (
                <article
                  className="w-full border rounded-sm flex justify-between bg-gray-200 text-gray-800"
                  key={tarea.id}
                >
                  <div className="w-full">
                    <h2 className="pl-1">
                      <strong>Tarea:</strong> {tarea.titulo}
                    </h2>
                    <p className="pl-1">
                      <strong>Descripción:</strong> {tarea.descripcion}
                    </p>
                  </div>
                  <form action={eliminarTarea}>
                    <input type="hidden" name="id" value={tarea.id} />
                    <button className="w-20 h-1/2 mt-1 mr-1 rounded-sm bg-gray-600 text-gray-100 hover:bg-gray-400 hover:text-gray-800">
                      Borrar
                    </button>
                  </form>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
