require('dotenv').config()

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const SpotifyWebApi = require('spotify-web-api-node')

const app = express()

app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  })
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error))

// Our routes go here:
app.get('/', (req, res) => {
    res.render('index')
})

app.get('/artist-search', (req, res) => {
    console.log(req.query)
    const artist = req.query.artistSearch
    spotifyApi
  .searchArtists(artist)
  .then(data => {
    console.log('The received data from the API: ', data.body)
    const artistAlbums = data.body.artists.items
    res.render('artist-search-results', {artistAlbums})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err))
})

app.get('/artist-search-results', (req, res) => {
    res.render('artist-search-results.ejs')
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))

