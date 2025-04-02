const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("./db.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3001;

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Add custom middleware for authentication (simplified)
server.use((req, res, next) => {
  if (req.method === "POST") {
    // Simulate a user ID for new resources
    if (
      req.path === "/movies" ||
      req.path === "/reviews" ||
      req.path === "/lists"
    ) {
      req.body.userId = req.body.userId || "1"; // Default to demo user
      req.body.createdAt = new Date().toISOString();
    }
  }
  next();
});

server.use(router);
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
