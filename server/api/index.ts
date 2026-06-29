import App from '../src/App';
import { connectDB } from '../src/config/Db';
import { connectRedis } from '../src/config/Redis';

// Ensure database connections are established
connectDB().catch(err => console.error('DB Connection Error:', err));
connectRedis().catch(err => console.error('Redis Connection Error:', err));

const appInstance = new App();
export default appInstance.app;
