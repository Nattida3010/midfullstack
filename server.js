
var express = require('express');
var pgp = require('pg-promise')();
//var db =pgp(process.env.DATABASE_URL);
var db = pgp('postgres://sguzzrbjzwawcf:b9b96230384d50890bff7be60b7b32a703beca2827c9f83f3eaaa9c96f6ff251@ec2-54-243-147-162.compute-1.amazonaws.com:5432/d9i6vbnk6jnrb4?ssl=true')
var app = express();
var moment = require('moment');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 


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




// Display all user
app.get('/users/:id', function(req, res) {
    
    var id =req.params.id;
    var time = moment().format();
    var sql = "select * from users where id= " + id;
    db.any(sql)
        .then(function (data) {
            
            res.render('pages/user_edit', { user: data[0],time:time })

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
    })

//users
app.get('/users', function (req, res) {
    db.any('select* from users order by id ASC')
        .then(function (data) {
            console.log('DATA' + data);
            res.render('pages/users', { users: data })
        })
        .catch(function (error) {
            console.log('ERROR : ' + error);
        });
});
//all product 
app.get('/products/:pid', function (req, res) {
    var pid = req.params.pid;
    var time = moment().format();
    var sql = "select * from products where id =" + pid;
     db.any(sql)
.then(function (data) {
    
    res.render('pages/product_edit', { product: data[0],time:time  })
})
.catch(function (error) {
    console.log('ERROR:' + error);
});
});
//display all products
app.get('/products', function (req, res) {
    db.any('select* from products order by id ASC')
        .then(function (data) {
            console.log('DATA' + data);
            res.render('pages/products', { products: data })
        })
        .catch(function (error) {
            console.log('ERROR : ' + error);
        });
});

//add Product
app.post('/products/add_product', function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var time = req.body.time;
    // var tags = req.body.tags;
    
    var sql = `INSERT INTO products (id, title, price,created_at) 
    VALUES ('${id}', '${title}', '${price}', '${time}')`;
    // res.send(sql)
 
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
    var time = moment().format();
    res.render('pages/add_product', {time:time});
});

///update product
app.post('/products/update',function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var time = req.body.time;
    var sql = `update products set title = '${title}', price = '${price}' , created_at='${time}' where id = '${id}'`;
     //db.none
    db.any(sql)
        .then(function (data) {
            res.redirect('/products')
        })
        .catch(function (error) {
            console.log('ERROR:' + console.error);
        })

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


//add users
app.get('/add_user', function(req, res) {
    var time = moment().format();
    res.render('pages/add_user',{time: time});    
    })
app.post('/users/add_user', function (req, res) {
    var id = req.body.id;
    var email = req.body.email;
    var password = req.body.password;
    var time = req.body.time;
    var sql = `INSERT INTO users (id,email,password,created_at)
    VALUES ('${id}', '${email}', '${password}','${time}')`;
    //db.none
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/users')
        })

        .catch(function (error) {
            console.log('ERROR:' + error);
        })      
});


 //Edit User
//update users
app.post('/users/update',function (req,res) {
    var id =req.body.id;
    var email =req.body.email;
    var password =req.body.password;
    var time = req.body.time;
    var sql=`update users set email='${email}',password='${password}', created_at='${time}' where id=${id}`;
    // res.send(sql)
    //db.none
    db.query(sql);
        res.redirect('/users')    
    db.close();
    })

//Delete User
app.get('/user_delete/:pid', function (req, res) {
    var pid = req.params.pid;
    var sql = 'DELETE FROM users';
    if (pid) {
        sql += ' where id =' + pid;
    }
    db.query(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/users');

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});
//report Products
app.get('/report_product', function (req, res) {
    var id = req.param('id');
    var sql = 'select* from products ORDER BY Price DESC limit 10';
    if (id) {
        sql += ' where id =' + id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/report_product', { products: data })

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })

});
//report user
app.get('/report_user', function (req, res) {
    db.any('select * from users ORDER BY  email ASC', )
        .then(function (data) {
            console.log('DATA' + data);
            res.render('pages/report_user', { users: data })

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })

});
//report Products
app.get('/report_product', function (req, res) {
    var id = req.param('id');
    var sql = 'select* from products ORDER BY Price ASC';
    if (id) {
        sql += ' where id =' + id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/report_product', { products: data })

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })

});


var port = process.env.PORT || 8080;
app.listen(port, function() {
console.log('App is running on http://localhost:' + port);
});

function newFunction() {
    return '/products/add_product';
}
