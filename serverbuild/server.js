// @bun
// server.ts
var server = Bun.serve({
  port: 3000,
  fetch(req, server2) {
    const url = new URL(req.url);
    console.log(`upgrade!`);
    const username = req.url;
    const success = server2.upgrade(req, { data: { username } });
    return success ? undefined : new Response("WebSocket upgrade error", { status: 400 });
  },
  websocket: {
    open(ws) {
      const msg = `${ws.data.username} has entered the chat`;
      ws.subscribe("the-group-chat");
      server.publish("the-group-chat", msg);
    },
    message(ws, message) {
      server.publish("the-group-chat", `${ws.data.username}: ${message}`);
    },
    close(ws) {
      const msg = `${ws.data.username} has left the chat`;
      ws.unsubscribe("the-group-chat");
      server.publish("the-group-chat", msg);
    }
  }
});
console.log(`Listening on ${server.hostname}:${server.port}`);
