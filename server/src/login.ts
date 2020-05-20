import app from './app';

// Start login server
const port = 3004;
app.listen({ port }, () => console.log(`Server  🚀 started on port ${port}`));
