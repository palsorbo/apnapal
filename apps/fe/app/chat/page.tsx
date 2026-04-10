import type { Metadata } from "next";
import ChatShell from "../components/chat-shell";

export const metadata: Metadata = {
  title: "Chat",
  robots: {
    index: false,
    follow: false
  }
};

export default function ChatPage() {
  return <ChatShell />;
}
