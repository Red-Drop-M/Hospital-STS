const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Réécriture des réponses pour matcher votre interface
router.render = (req, res) => {
  if (req.method === 'GET' && req.path === '/bloodrequests') {
    res.jsonp({
      content: res.locals.data,
      success: true,
      Total: res.locals.data.length
    });
  } else {
    res.jsonp(res.locals.data);
  }
};

server.use(router);
server.listen(3001, () => {
  console.log('JSON Server is running on port 3001');
});