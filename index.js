// Defining the PORT
const PORT = process.env.PORT || 8000
// Initialize Express
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
// Calling express function and put the new express application inside the app variable to set new express application
const app = express()

const newspapers = [
  {
    name: 'thetimes',
    address: 'https://www.thetimes.co.uk/environment/climate-change',
    base: ''
  },
  {
    name: 'guardian',
    address: 'https://www.theguardian.com/environment/climate-crisis',
    base: ''
  },
  {
    name: 'telegraph',
    address: 'https://www.telegraph.co.uk/climate-change/',
    base: 'https://telegraph.co.uk'
  }



]
// Create an empty array to return the contains inside, as json format
const articles = []

newspapers.forEach(newspapers => {
  axios.get(newspapers.address)
    .then(response => {
      const html = response.data
      const $ = cheerio.load(html)

      $('a:contains("climate")', html).each(function () {
        const title = $(this).text
        const url = $(this).attr('href')

        articles.push({
          title,
          url: newspapers.base + url,
          source: newspapers.name
        })
      })

    })
})

// home page route
app.get('/', (req, res) => {
  res.json('Welcome to my Climate Change News API')
})

// Get the path news as an HTML respond format (using axios)
app.get('/news', (req, res) => {
  res.json(articles)
})

// route to get news from one newspaper article
app.get('/news/:newspaperId', (req, res) => {
  const newspaperId = req.params.newspaperId

  // filter the array and get one specific website
  const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
  const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base


  axios.get(newspaperAddress)
    .then(response => {
      const html = response.data
      const $ = cheerio.load(html)
      const specificArticles = []

      $('a:contains("climate")', html).each(function () {
        const title = $(this).text()
        const url = $(this).attr('href')
        specificArticles.push({
          title,
          url: newspaperBase + url,
          source: newspaperId
        })
      })
      res.json(specificArticles)
    }).catch(err => console.log(err))
})




// Sending us back a message that says everything running fine on the port (Server)
app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))