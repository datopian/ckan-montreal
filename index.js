module.exports = function (app) {
  const appHome = process.cwd()
  const dms = require(`${appHome}/lib/dms`)
  const config = require(`${appHome}/config`)
  const Model = new dms.DmsModel(config)
  const fs = require('fs')
  const path = require('path')
  const fetch = require('node-fetch')
  
	// set a cookie with default locale = fr
	app.use(function (req, res, next) {
		let locale = req.cookies && req.cookies.defaultLocale || 'fr'
		if (locale) res.setLocale(locale)
    next()
	})

  app.get('/dash', (req, res) => {
    const dashPage = fs.readFileSync(path.resolve(__dirname, './public/dash/index.html'))
    res.render('dash.html', {
      title: 'Dashboard',
      content: {dash: dashPage}
    })
  })

  app.get('/dashboard/:name', async (req, res) => {
    const base = config.get('GITHUB_BASEURL')
    const username = config.get('GITHUB_USERNAME')
    const prefix = config.get('DASH_PREFIX')
    const url = `${base}/${username}/${prefix}_${req.params.name}/master/dashboard.json`
    const response = await fetch(url)
    const data = await response.text()
    res.render('dashboard.html', {
      title: req.params.name,
      dashData: data
    })
  })
  
  app.get('/', async (req, res) => {
    const collections = await Model.getCollections()
    res.render('home.html', {
      title: 'Montreal',
      collections,
      slug: 'collections',
    })
  })

  app.get('/tx', (req, res) => {
    res.send(res.__('Complete'))
  })

}
