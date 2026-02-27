    const express = require('express');
    const app = express();
    const port = 3000; // You can choose any available port



        app.get('/', (req, res) => {
        res.send('Hello from your Node.js!');
    });


        app.listen(port, () => {
        console.log(`API listening at http://localhost:${port}`);
    });