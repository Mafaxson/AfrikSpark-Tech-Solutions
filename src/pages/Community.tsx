import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Section } from "@/components/SectionComponents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navigate } from "react-router-dom";
import { Send, Hash, MessageSquare } from "lucide-react";

export default function Community() {
  const { user, isApproved, loading } = useAuth();
  const [channels, setChannels] = useState<any[]>([]);
  const [activeChannel, setActiveChannel] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!user || !isApproved) return;
    supabase.from("channels").select("*").order("name").then(({ data }) => {
      if (data) {
        setChannels(data);
        if (data.length > 0) setActiveChannel(data[0].id);
      }
    });
  }, [user, isApproved]);

  useEffect(() => {
    if (!activeChannel || !user || !isApproved) return;
    supabase.from("messages")
      .select("*, profiles(display_name)")
      .eq("channel_id", activeChannel)
      .order("created_at", { ascending: true })
      .then(({ data }) => { if (data) setMessages(data); });

    const channel = supabase.channel(`messages-${activeChannel}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `channel_id=eq.${activeChannel}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeChannel, user, isApproved]);

  if (loading) return <Layout><Section><p>Loading...</p></Section></Layout>;
  if (!user) return <Navigate to="/login" replace />;
  if (!isApproved) {
    return (
      <Layout>
        <Section className="min-h-[60vh] flex items-center">
          <div className="text-center max-w-md mx-auto">
            <MessageSquare className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="font-display text-2xl font-bold mb-2">Awaiting Approval</h1>
            <p className="text-muted-foreground">Your account is pending admin approval. You'll be able to access the community once approved.</p>
          </div>
        </Section>
      </Layout>
    );
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChannel) return;
    await supabase.from("messages").insert({
      channel_id: activeChannel,
      user_id: user.id,
      content: newMessage,
    });
    setNewMessage("");
  };

  return (
    <Layout>
      <Section>
        <h1 className="font-display text-3xl font-bold mb-8">Community</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[60vh]">
          <div className="bg-card rounded-xl border border-border p-4 space-y-1">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Channels</h3>
            {channels.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveChannel(c.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                  activeChannel === c.id ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Hash className="h-4 w-4" />
                {c.name}
              </button>
            ))}
          </div>

          <div className="md:col-span-3 bg-card rounded-xl border border-border flex flex-col">
            <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-[60vh]">
              {messages.map(m => (
                <div key={m.id} className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">
                      {(m.profiles?.display_name ?? "U").charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-semibold">{m.profiles?.display_name ?? "User"}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm">{m.content}</p>
                  </div>
                </div>
              ))}
              {messages.length === 0 && (
                <p className="text-muted-foreground text-center py-10">No messages yet. Start the conversation!</p>
              )}
            </div>
            <div className="border-t border-border p-4 flex gap-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
              />
              <Button onClick={sendMessage} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </Layout>
  );
}
