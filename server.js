
var express = require('express');
var pgp = require('pg-promise')();
//var db =pgp(process.env.DATABASE_URL);
var db = pgp('postgres://sguzzrbjzwawcf:b9b96230384d50890bff7be60b7b32a703beca2827c9f83f3eaaa9c96f6ff251@ec2-54-243-147-162.compute-1.amazonaws.com:5432/d9i6vbnk6jnrb4?ssl=true')
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

/*app.get('/',function(request, response){
    response.send('Hello, ExpressJS');
    });

app.get('/test',function(request, response){
    response.send('<H1>Test</H1>');
    });*/
//app.use(express.static('static'));
app.set('view engine', 'ejs');
app.get('/', function (req, res) {
    res.render('pages/index');
});
app.get('/index', function (req, res) {
    res.render('pages/index');
});
app.get('/about', function (req, res) {
    var name = 'Puinun';
    var hobbies = ['Football', 'Movie', 'Programming']
    var bdate = '06/08/1997'
    res.render('pages/about', { nickname: name, hobbies: hobbies, bdate: bdate });
});
//display all products
app.get('/products', function (req, res) {
    db.any('select* from products')
    var id = req.param('id');
    var sql = ('select * from products order by id ASC');
    if (id) {
        sql += ' where id =' + id;

    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/products', { products : data })
        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })

});
app.get('/users', function (req, res){
    var id = req.param('id');
    var sql = 'select* from users';

    if(id){
        sql += ' Where id ='+id;
    }
  
    db.any(sql)
    .then(function(data){
        console.log('DATA'+data);
        //res.json(data);
        res.render('pages/users',{users : data})
        
    })
    .catch(function(error){
        console.log('ERROR : '+error);
    })


});
app.get('/users/:id', function (req, res) {
    var id = req.params.id;
    db.any('select* from users')
    var id = req.param('id');
    var sql = 'select * from users';
    if (id) {
        sql += ' where id =' + id;

    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/users', { users: data })
        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        });
});

app.get('/products/:pid', function (req, res) {
    var pid = req.params.pid;
    var sql = "select * from products where id =" + pid;
     db.any(sql)
.then(function (data) {
    console.log(data[0])
    res.render('pages/product_edit', { product: data[0] })
})
.catch(function (error) {
    console.log('ERROR:' + error);
});
});



//addnewproduct

app.post('/product/add_product', function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var sql = `INSERT INTO products (id, title, price)
    VALUES ('${id}', '${title}', '${price}')`;
    //db.none
    console.log('UPDATE:' + sql);
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/products')

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
})
app.get('/add_product', function (req, res) {
    res.render('pages/add_product');
})
///update
app.post('/product/update',function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var sql = `update products set title = '${title}', price = '${price}' where id = '${id}'`;
     //db.none
    db.any(sql)
        .then(function (data) {
            res.redirect('/products')
        })
        .catch(function (error) {
            console.log('ERROR:' + console.error);
        })

});
app.get('/add_product', function (req, res) {
    res.render('pages/add');
});
//delete product button
app.get('/product_delete/:id', function (req, res) {
    var id = req.params.id;
    var sql = 'DELETE FROM products';
    if (id) {
        sql += ' where id =' + id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/products');

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});

// console.log('App is running at http://localhost:8080');
// app.listen(8080);
app.get('/insert', function (req,res) {
    var time = moment().format('MMMM Do YYYY, h:mm:ss a');
    res.render('pages/insert', { time: time});
});
var port = process.env.PORT || 8080;
app.listen(port, function() {
console.log('App is running on http://localhost:' + port);
});

function newFunction() {
    return '/products/add_product';
}
