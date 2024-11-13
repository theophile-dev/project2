
const server = Bun.serve<{ username: string }>({
  port: 3000,
  fetch(req, server) {
    const url = new URL(req.url);
    console.log(`upgrade!`);
    const username = req.url;
    const success = server.upgrade(req, { data: { username } });
    return success
      ? undefined
      : new Response("WebSocket upgrade error", { status: 400 });
  },
  websocket: {
    open(ws) {
      const msg = `add:${ws.data.username}`;
      ws.subscribe("the-group-chat");
      server.publish("the-group-chat", msg);
    },
    message(ws, message) {
      // this is a group chat
      // so the server re-broadcasts incoming message to everyone
      server.publish("the-group-chat", `${ws.data.username}:${message}`);
    },
    close(ws) {
      const msg = `rm:${ws.data.username}`;
      ws.unsubscribe("the-group-chat");
      server.publish("the-group-chat", msg);
    },
  },
});

console.log(`Listening on ${server.hostname}:${server.port}`);