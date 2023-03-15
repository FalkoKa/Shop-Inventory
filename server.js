const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const session = require('express-session');
const MemoryStore = require('memorystore')(session);

const logger = require('./middlewares/logger');
const methodOverride = require('./middlewares/method-override');

const setCurrentUser = require('./middlewares/set_current_user');
const viewHelpers = require('./middlewares/view_helpers');
const ensureAdmin = require('./middlewares/ensure_admin');

// controllers
const categoriesController = require('./controllers/categories_controller');
const itemsController = require('./controllers/items_controller');
const adminController = require('./controllers/admin_controller');
const sessionController = require('./controllers/session_controller');
const userController = require('./controllers/user_controller');

const expressLayouts = require('express-ejs-layouts');

app.set('view engine', 'ejs');

app.use(logger);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride);
app.use(expressLayouts);
app.use(
  session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
    secret: process.env.SECRET_KEY || 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(setCurrentUser);
app.use(viewHelpers);

// routes
app.get('/', (req, res) => {
  res.render('home');
});

app.use('/', sessionController);
app.use('/categories', categoriesController);
app.use('/items', itemsController);
app.use('/admin', ensureAdmin, adminController);
app.use('/', userController);
app.use((req, res) => {
  res.render('404');
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
