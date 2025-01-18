import 'dotenv/config.js';

import http from 'http';
import app from './app.js';

const port = process.env.PORT || 3000;


const server = http.createServer(app);

app.use((req, res, next) => {
    console.log(`🔹 Request: ${req.method} ${req.originalUrl}`);
    next();
});




server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
   
});