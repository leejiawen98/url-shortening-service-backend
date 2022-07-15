const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mysql = require('mysql')

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'url-database'
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
