const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const res = require('express/lib/response');

const messagebird = require('messagebird')('EkVBzC4N5spuXdlKQ2cKaQFab');

const app = express();

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));

app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({extended:true}));

app.get('/', (req,res) => {
    res.render('step1');
})

app.post('/step2', (req,res) => {
    var number = req.body.number;

    messagebird.verify.create(number, {
        template: "Your verification code is %token"
    }), (err, response) => {
        if(err){
            console.log(err);
            res.render('step1', {
                error: err.errors[0].description
            });
        }else{
            console.log(response)
            res.render('step2', {
                id: response.id
            })
        }
    }
})

app.post('/step3', (req,res) => {
    var id = req.body.id;
    var token = req.body.token;

    messagebird.verify.verify(id, token, (req,res) => {
        if(err){
            console.log(err)
            res.render('step2', {
                error: err.errors[0].description,
                id: id
            });
        }else{
            res.render('step3');
        }
    })
})

app.listen(3000, () => console.log(`port is running on 3000`))