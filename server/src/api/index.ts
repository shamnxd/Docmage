import App from '../App.js';
import { connectDB } from '../config/Db.js';
import { connectRedis } from '../config/Redis.js';

// Ensure database connections are established
connectDB().catch(err => console.error('DB Connection Error:', err));
connectRedis().catch(err => console.error('Redis Connection Error:', err));

const appInstance = new App();
export default appInstance.app;
