import App from './App';
const server = new App();
server.listen().catch((error) => {
  console.error('[Startup Error]:', error);
  process.exit(1);
});