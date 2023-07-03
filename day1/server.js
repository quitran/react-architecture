import express from 'express';
import React from "react";
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './src/App';
import path from 'path';
import fs from 'fs';

const app = express();

//Build the code without file index.html to return the permission of SSRS to server
app.use(express.static('./build', { index: false }))

app.get('/*', (req, res) => {
    const reactApp = renderToString(
        <StaticRouter location={req.url} >
            <App />
        </StaticRouter>
    );

    const templateFile = path.resolve('./build/index.html');
    fs.readFile(templateFile, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send(err);
        }

        return res.send(
            data.replace('<div id="root"></div>', `<div id="root">${reactApp}</div>`)
        )
    })

    // return res.send(`
    // <html> 
    // <body>
    //     <div id="root"> ${reactApp} </div>
    // </body>
    // </html>
    // `);
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
})