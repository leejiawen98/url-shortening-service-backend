const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mysql = require('mysql')

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'url_database'
})

// CORS Configuration
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    )
    if (req.method === "OPTIONS") {
      res.header(
        "Access-Control-Allow-Methods",
        "POST, PUT, PATCH, GET, DELETE"
      )
      return res.status(200).json({})
    }
    next()
  })

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}))

app.listen(process.env.PORT || 3001, () => {
    console.log('running on ' + (!process.env.PORT ? '3001' : 'hosted url'));
})

// Routes
app.get('/', (req, res) => {
    res.status(200).send("Connected");
});

app.post('/post/shorten', (req, res) => {
    const url = req.body.url;

    const checkSql = "SELECT * FROM shortened_urls WHERE url = ?";
    db.query(checkSql, [url], (err, result) => {
        if (result.length === 0) {
            //Generate random alphanumeric string
            const short_url = "/" + Math.random().toString(36).slice(6);
            
            const sql = "INSERT INTO shortened_urls (url, click, short_url) VALUES (?,?,?)";
            db.query(sql, [url, 0, short_url], (err, result) => {
                if (result) {
                    res.status(201).send(short_url);
                } else {
                    console.log(err.sqlMessage);
                    res.status(400).send(err.sqlMessage)
                }
            });
        } else if (result.length > 0) {
            res.status(200).send(result);
        }
    })
});

app.get('/get/urls', (req, res) => {
    const sql = "SELECT * FROM shortened_urls";
    db.query(sql, (err, result) => {
        if (result) {
            res.status(200).send(result);
        } else {
            res.status(400).send(err.sqlMessage)
        }
    });
});

app.post('/post/url', (req, res) => {
    const shortUrl = req.body.shortUrl;
    const sql = "SELECT url FROM shortened_urls WHERE short_url = ?";
    db.query(sql, [shortUrl], (err, result) => {
        if (result.length > 0) {
            res.status(200).send(result);
        } else if (result.length === 0) {
            res.status(404).send("Not Found")
        }
        if (err) {
            res.status(400).send(err.sqlMessage)
        }
    });
});
