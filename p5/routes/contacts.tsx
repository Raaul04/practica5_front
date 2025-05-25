import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import ChatBox from "../islands/ChatBox.tsx";
import { Contact } from "../types.ts";

type Mensaje = {
  _id: string;
  content: string;
  isContactMessage?: boolean;
  timestamp: string;
};

type Data = {
  contacts: Contact[];
  chatId: string; 
  name: string; 

};


export const handler: Handlers = {
  
  GET: async (req: Request, ctx: FreshContext<unknown, Data>) => {
    try {
      const response = await fetch("https://back-a-p4.onrender.com/contacts");

      if (!response.ok) throw new Error("Error al obtener contactos");
      const json = await response.json();
      const contacts: Contact[] = json.data;

      const url = new URL(req.url);
      const chatId = url.searchParams.get("chatId") || "";

      const selectedContact = contacts.find((c) => c.chatId === chatId);
      const name = selectedContact ? selectedContact.name : "";

      return ctx.render({ contacts, chatId, name}); 
    } catch (error) {
      console.error("Error general en handler:", error);
      return new Response("Error cargando contactos", { status: 500 });
    }
  },

 
};



const Page = (props: PageProps<Data>) => {
  const { contacts, chatId, name } = props.data; 

  return (
    <div class="main">
      <div class="container">
        <div class="contacts">
          <a href="/add">
            <h1 class="crear">Crear contacto</h1>
          </a>
          <ul>
            {contacts.map((contact) => (
              <li key={contact.id}>
                <h3>{contact.name}</h3>
                {contact.phone}
                <br />
                <br />
                <form method="GET" action="/contacts">
                  <input type="hidden" name="chatId" value={contact.chatId} />
                  <button type="submit">Ver chat</button>
                </form>
              </li>
            ))}
          </ul>
        </div>
      </div>

      
      <div class ="chat-container">
        <h1 >Chat</h1>
        <h2 class="nombre_chat">{ name || "Selecciona un contacto"}</h2>
          {chatId && <ChatBox chatId={chatId} />}

      </div>
    
    </div>
  );
};



export default Page;