// Defining the PORT
const PORT = 8000

// Initialize Express
const express = require('express')


const axios = require('axios')
const cheerio = require('cheerio')
const { response } = require('express')

// Calling express function and put the new express application inside the app variable to set new express application
const app = express()

// home page route
app.get('/', (req, res) => {
  res.json('Welcome to my Climate Change News API')
})

// Get the path news as an HTML respond format (using axios)
app.get('/news', (req, res) => {
  axios.get('https://www.theguardian.com')
    .then((response) => {
      const html = response.data
      // pick out the elements using cheerio
      const $ = cheerio.load(html)
      // look for any a tag that contains the word Climate
      $('a:contains("climate")', html).each(function () {
        const title = $(this).text()
        const url = $(this).attr('href')
        articles.push({
          title,
          url
        })
      })
      res.json(articles)
    }).catch((err) => console.log(err))
})




// Sending us back a message that says everything running fine on the port (Server)
app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))