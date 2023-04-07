import express from 'express';
import Contact from "../models/contact";

const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Home', page: "home", displayName: ""});
});

router.get('/home', function (req, res, next) {
    res.render('index', {title: 'Home', page: "home", displayName: ""});
});

router.get('/about', function (req, res, next) {
    res.render('index', {title: 'About Us', page: "about", displayName: ""});
});

router.get('/contact', function (req, res, next) {
    res.render('index', {title: 'Contact Us', page: "contact", displayName: ""});
});

router.get('/add', function (req, res, next) {
    res.render('index', {title: 'Add Contact', page: "edit", contact: '', displayName: ""});
});

router.post('/add', function (req, res, next) {


    let AddContact = new Contact(
        {
            "FullName": req.body.fullName,
            "ContactNumber": req.body.contactNumber,
            "EmailAddress": req.body.emailAddress
        }
    );

    Contact.create(AddContact).then(function (contacttoEdit) {

        res.redirect('/contact-list');

    }).catch(function (err) {
        console.error("Failed to edit contact " + err);
        res.end()
    })
});

router.get('/delete/:id', function (req, res, next) {

    let id = req.params.id

    Contact.deleteOne({_id: id}).then(function (contacttoEdit) {

        res.redirect('/contact-list');

    }).catch(function (err) {

        console.error("Failed to delete contact  " + err);
        res.end()

    });
});


router.get('/contact-list', function (req, res, next) {

    Contact.find().then(function (data) {
        console.log(data);

        res.render('index', {title: 'Contact List', page: "contact-list", contacts: data, displayName: ""
        });

    }).catch(function (err) {
        console.error("Encountered an Error reading from the Database: " + err);
        res.end();
    });
});


router.get('/edit:id', function (req, res, next) {

    let id = req.params.id

    Contact.findById(id).then(function (contacttoEdit) {

        res.render('index', {title: 'Edit Page', page: "edit", contact: contacttoEdit, displayName: ""});

    }).catch(function (err) {

        console.error("Failed to reteive contact from database " + err);
        res.end()

    })
});

router.get('/edit:id', function (req, res, next) {

    let id = req.params.id;

    let updatedContact = new Contact(
        {
            "_id": id,
            "FullName": req.body.fullName,
            "ContactNumber": req.body.contactNumber,
            "EmailAddress": req.body.emailAddress
        }
    );


    Contact.updateOne({_id: id}, updatedContact).then(function (contacttoEdit) {

        res.redirect('/contact-list');

    }).catch(function (err) {
        console.error("Failed to edit contact " + err);
        res.end()
    })
    res.render('index', {title: 'Edit Page', page: "edit", displayName: ""});
});


router.get('/login', function (req, res, next) {
    res.render('index', {title: 'Login Page', page: "login", displayName: ""});
});

router.get('/products', function (req, res, next) {
    res.render('index', {title: 'Product Page', page: "products", displayName: ""});
})

router.get('/register', function (req, res, next) {
    res.render('index', {title: 'Register Page', page: "register", displayName: ""});
});

router.get('/services', function (req, res, next) {
    res.render('index', {title: 'Services Page', page: "services", displayName: ""});
});


export default router;