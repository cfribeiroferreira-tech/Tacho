import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createServer as createHttpServer } from "http";
import { Server } from "socket.io";
import cron from "node-cron";

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;
  const httpServer = createHttpServer(app);
  
  const io = new Server(httpServer, {
    cors: { origin: "*" }
  });

  // Setup simulated web scraping cron job
  // In a real app, this would use Puppeteer/Cheerio to scrape actual prices
  let lastScrapedAt = new Date().toISOString();
  let dailyPriceFluctuation = 1.0; 

  cron.schedule("0 12 * * *", () => {
    console.log("Running daily UI/Web scraping cron job for supermarket prices...");
    // Simulate updating price multipliers (fluctuating between 0.95 and 1.05)
    dailyPriceFluctuation = 0.95 + Math.random() * 0.1;
    lastScrapedAt = new Date().toISOString();
    
    // Broadcast new prices to all connected clients
    io.emit("prices-updated", {
      lastScrapedAt,
      multiplier: dailyPriceFluctuation
    });
  });

  // API endpoint for Initial Load
  app.get("/api/prices/meta", (req, res) => {
    res.json({
      lastScrapedAt,
      multiplier: dailyPriceFluctuation
    });
  });

  app.post("/api/log", (req, res) => {
    console.log("CLIENT LOG:", req.body);
    res.json({ ok: true });
  });

  // In-memory store for rooms
  const rooms = new Map<string, any>();

  io.on("connection", (socket) => {
    let currentRoom: string | null = null;
    
    socket.on("join-room", (roomId: string, initialState: any) => {
      if (currentRoom) {
        socket.leave(currentRoom);
      }
      
      socket.join(roomId);
      currentRoom = roomId;

      if (!rooms.has(roomId) && initialState) {
        rooms.set(roomId, initialState);
      }

      // Send current state to the joining user
      if (rooms.has(roomId)) {
        socket.emit("state-sync", rooms.get(roomId));
      }
    });

    socket.on("state-update", (roomId: string, newState: any) => {
      if (rooms.has(roomId) || roomId) {
        rooms.set(roomId, newState);
        // Broadcast to everyone else in the room
        socket.to(roomId).emit("state-sync", newState);
      }
    });

    socket.on("disconnect", () => {
      // nothing specific to clear unless room is empty, but in-memory map is fine for MVP
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
