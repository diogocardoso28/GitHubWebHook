const express = require('express');
var bodyParser = require('body-parser');
const crypto = require('crypto');
const { exec } = require('child_process');
const dotenv = require('dotenv');
dotenv.config();

const app = express()
const port = process.env.PORT

// create application/json parser
app.use(bodyParser.json({
    verify: (req, res, buf) => {
        req.rawBody = buf
    }
}))

app.get('/',(req,res) => {
res.redirect('/webhook')
})
app.get('/webhook', (req, res) => {
    res.send('GitHubWebHook is listening 👂')
})

//Respond to webhook
app.post('/webhook', (req,res) => {
    //Validate payload
    const secret = process.env.SECRET
    if (!is_valid(req,secret)) {
        res.sendStatus(403)
        return;
    }

    //Check for event
    const event = req.get("X-GitHub-Event")
    if (event === "ping") {
        res.sendStatus(200)
        return
    }

    if (event ==="push") {
        var updateScript = exec('sh update.sh',
            (error, stdout, stderr) => {
                console.log(stdout);
                console.log(stderr);
                if (error !== null) {
                    console.log(`exec error: ${error}`);
                }
            });
    }

    res.sendStatus(200)
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

function is_valid(req,secret) {
    const sigHeaderName = 'X-Hub-Signature-256'
    const sigHashAlg = 'sha256'
    if (!req.rawBody) {
        return false
    }
    const sig = Buffer.from(req.get(sigHeaderName) || '', 'utf8')
    const hmac = crypto.createHmac(sigHashAlg, secret)
    const digest = Buffer.from(sigHashAlg + '=' + hmac.update(req.rawBody).digest('hex'), 'utf8')
    //Checks if secret is valid
    return !(sig.length !== digest.length || !crypto.timingSafeEqual(digest, sig));
}
