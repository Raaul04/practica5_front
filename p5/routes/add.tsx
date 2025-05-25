import { FreshContext, Handlers } from "$fresh/server.ts";
import { Contact } from "../types.ts";

type Data = {
  contacts: Contact[];
};

export const handler: Handlers = {
  POST: async (req: Request, ctx: FreshContext<unknown, Data>) => {
    const formData = await req.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");

    const newContact = { name, email, phone };

    const res = await fetch("https://back-a-p4.onrender.com/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newContact),
    });

    if (!res.ok) {
      return new Response("Error al crear contacto", { status: 500 });
    }

    return new Response(null, {
      status: 303,
      headers: { Location: "/contacts" },
    });
  },
};

const Page = () => {
  return (
    <div className="center">
      <h1>Crear Contacto</h1>
      <form method="POST">
        <input type="text" name="name" placeholder="Nombre" required />
        <input type="email" name="email" placeholder="Email" required />
        <input type="text" name="phone" placeholder="Teléfono" required />
        <button type="submit">Crear Contacto</button>
      </form>
    </div>
  );
};
export default Page;