const authRoute = require('./authRoute')
const dashboardRoute = require('./dashboardRoute')
const playgroundRoute = require('../playground/play')
const uploadRoute = require('./uploadRoutes')
const postRoute = require('./postRoute')
const apiRoutes = require('../api/routes/apiRoutes')
const exploreRoute = require('./exploreRoute')
const searchRoute = require('./searchRoute')
const authorRoute = require('./authorRoutes')


const routes = [
    {
        path: '/auth',
        handler: authRoute
    },
    {
        path: '/dashboard', 
        handler: dashboardRoute
    },
    {
        path: '/uploads',
        handler: uploadRoute
    },
    {
        path: '/posts',
        handler: postRoute
    },
    {
        path: '/api',
        handler: apiRoutes
    },
    {
        path: '/explorer',
        handler: exploreRoute
    },
    {
        path: '/search',
        handler: searchRoute
    },
    {
        path: '/author',
        handler: authorRoute
    },
    {
        path: '/playground',
        handler: playgroundRoute
    },
    {
        path: '/',
        handler: (req, res) => {
            res.redirect('/explorer')
        }
    }
]

module.exports = app => {
    routes.forEach(r => {
        if(r.path === '/') {
            app.get(r.path, r.handler)
        } else {
            app.use(r.path, r.handler)
        }
    })
}