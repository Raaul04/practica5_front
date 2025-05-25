import { useEffect, useState } from "preact/hooks";

type Mensaje = {
  _id: string;
  content: string;
  isContactMessage?: boolean;
  timestamp: string;
  chatId?: string;
};

export default function ChatBox({ chatId }: { chatId: string }) {
  const [messages, setMessages] = useState<Mensaje[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!chatId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`https://back-a-p4.onrender.com/messages/chat/${chatId}`);
        if (!res.ok) {
          const errorText = await res.text();
          setError("Error al obtener mensajes: " + errorText);
          return;
        }
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          setMessages(json.data);
        } else {
          setError("Formato de datos inesperado");
        }
      } catch (err) {
        setError("Error de conexión al obtener mensajes");
      }
    };

    fetchMessages();
  }, [chatId]);

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;
    setSending(true);
    try {
      const res = await fetch(`https://back-a-p4.onrender.com/messages/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newMessage,
          isContactMessage: false,
          chatId,  
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        setError("Error al enviar mensaje: " + errorText);
        setSending(false);
        return;
      }

      const savedMessage = await res.json();

      setMessages(prev => [...prev, savedMessage.data]);
      setNewMessage("");
    } catch (err) {
      setError("Error de conexión al enviar mensaje");
    } finally {
      setSending(false);
    }
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="my-chat-container">
      <div>
        {messages.length === 0 ? (
          <p>No hay mensajes en este chat</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`my-message-wrapper ${msg.isContactMessage ? "my-message-left" : "my-message-right"}`}
            >
              <div className={msg.isContactMessage ? "my-message-bubble-left" : "my-message-bubble-right"}>
                <p>{msg.content}</p>
                <p className="tiempo">{new Date(msg.timestamp).toLocaleTimeString()}</p>
              </div>
            </div>
          ))
        )}
      </div>

<div className="send-bar">
  <input
    type="text"
    value={newMessage}
    onInput={(e) => setNewMessage(e.currentTarget.value)}
    placeholder="Escribe un mensaje..."
    onKeyDown={(e) => {
      if (e.key === "Enter") sendMessage();
    }}
  />
  <button onClick={sendMessage}>Enviar</button>
</div>

    </div>
  );
}