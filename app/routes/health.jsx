import { json } from "@remix-run/node";

export const loader = async () => {
  try {
    // Check if we can connect to the database
    const prisma = (await import("../db.server")).default;
    await prisma.$queryRaw`SELECT 1`;
    
    return json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: "connected"
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: "disconnected",
      error: error.message
    }, { status: 500 });
  }
}; 