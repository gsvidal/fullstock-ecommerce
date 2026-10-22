import { useState, type SubmitEvent } from "react";
import {
  fetchServerSentEvents,
  useChat,
  type UIMessage,
} from "@tanstack/ai-react";
import { Button } from "./ui";
import { IdeaIcon } from "./ui/icons";
import { TextPart } from "@tanstack/ai-react/ui";
import type { RecommendedProduct } from "../services/chatbot.service";
import RecommendedProductCard from "./recommended-product-card";

type Turn = {
  id: string;
  role: UIMessage["role"];
  text: string;
  products: RecommendedProduct[];
};

function toTurns(messages: UIMessage[]): Turn[] {
  const turns: Turn[] = [];

  for (const message of messages) {
    let turn = turns.at(-1);

    if (turn?.role !== message.role) {
      turn = { id: message.id, role: message.role, text: "", products: [] };
      turns.push(turn);
    }

    for (const part of message.parts) {
      if (part.type === "text") turn.text += part.content;

      // El resultado de una tool del servidor llega en `output`.
      if (
        part.type === "tool-call" &&
        part.name === "recommend_products" &&
        Array.isArray(part.output)
      ) {
        turn.products.push(...(part.output as RecommendedProduct[]));
      }
    }
  }

  return turns;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const { messages, sendMessage, isLoading } = useChat({
    connection: fetchServerSentEvents("/chat"),
  });

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage(question);
    setQuestion("");
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <section className="flex h-[min(32rem,calc(100dvh-6rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-border bg-background shadow-lg">
          <h2 className="border-b border-border px-4 py-2 text-sm font-medium">
            Asistente de compras
          </h2>
          <div className="flex grow flex-col gap-3 overflow-y-auto p-4">
            {toTurns(messages).map((turn, index, turns) => (
              <ChatTurn
                key={turn.id}
                turn={turn}
                isStreaming={isLoading && index === turns.length - 1}
              />
            ))}
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex gap-2 border-t border-border p-2"
          >
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Busco un regalo para…"
              className="grow"
            />
            <Button type="submit">Enviar</Button>
          </form>
        </section>
      )}
      <Button size="lg" onClick={() => setIsOpen(!isOpen)}>
        <IdeaIcon />
        Asistente
      </Button>
    </div>
  );
}

type ChatTurnProps = {
  turn: Turn;
  isStreaming: boolean;
};

function ChatTurn({ turn, isStreaming }: ChatTurnProps) {
  if (turn.role === "user") {
    return (
      <p className="max-w-[85%] self-end rounded-lg bg-muted-background px-3 py-2 text-sm whitespace-pre-wrap">
        {turn.text}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {turn.text && <TextPart content={turn.text} className="prose prose-sm" />}
      {!isStreaming && turn.products.length > 0 && (
        <ul className="flex flex-col gap-2">
          {turn.products.map((product) => (
            <li key={product.slug}>
              <RecommendedProductCard product={product} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
