require('./utils/db')
const { getContacts } = require('./models/contact')

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const { body, validationResult, check } = require('express-validator')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const methodOverride = require('method-override')


const app = express()
const port = 3000

app.use(methodOverride('_method'))

app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser('secret'))
app.use(session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})

// konfigurasi flash
app.use(cookieParser('secret'))
app.use(
    session({
        cookie: { maxAge: 6000 },
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
    })
)
app.use(flash())

// Halaman Home
app.get('/', (req, res) => {
    res.render('home', {
        title: 'Halaman Home',
        layout: 'layout/mainlayout',
    })
})

// Halaman Contact
app.get('/contact', async (req, res) => {
    const contacts = await getContacts.find()
    res.render('contact', {
        title: 'Contact',
        layout: 'layout/mainlayout',
        contacts,
        msg: req.flash('msg')
    })
})

// Halaman Add Contact
app.get('/contact/add', (req, res) => {
    res.render('add-contact', {
        title: 'Form Add Contact',
        layout: 'layout/mainlayout',
    })
})

// proses add contact
app.post('/contact',
    [
        body('name').custom(async (value) => {
            const duplicate = await getContacts.findOne({ name: value })
            if (duplicate) {
                throw new Error('Contact sudah terdaftar !')
            }
            return true
        }),
        check('email', 'Email Tidak Valid').isEmail(),
        check('noHP', 'No HP Tidak Valid').isMobilePhone('id-ID')
    ],
    (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.render('add-contact', {
                title: 'Form Add Contact',
                layout: 'layout/mainlayout',
                errors: errors.array()
            })
        } else {
            getContacts.insertMany(req.body)
            req.flash('msg', 'Data contact berhasil ditambahkan !')
            res.redirect('/contact')
        }
    }
)

// Halaman Detail Contact
app.get('/contact/:name', async (req, res) => {
    const contact = await getContacts.findOne({ name: req.params.name })
    res.render('detail', {
        title: 'Detail Contact',
        layout: 'layout/mainlayout',
        contact
    })
})


// delete
app.delete('/contact', async (req, res) => {
    getContacts.deleteOne({ name: req.body.name }).then((result) => {
        req.flash('msg', 'Data contact berhasil dihapus !')
        res.redirect('/contact')
    })
})

// form edit
app.get('/contact/edit/:name', async (req, res) => {
    const contact = await getContacts.findOne({ name: req.params.name })
    if (!contact) {
        res.status(404)
        res.send('Contact Not Found !')
    } else {
        res.render('edit-contact', {
            title: 'Form Update Contact',
            layout: 'layout/mainlayout',
            contact,
        })
    }
})


// proses edit
app.put('/contact',
    [
        body('name').custom(async (value, { req }) => {
            const duplicate = await getContacts.findOne({ name: value })
            if (duplicate && value !== req.body.oldName) {
                throw new Error('Contact sudah terdaftar !')
            }
            return true
        }),
        check('email', 'Email Tidak Valid').isEmail(),
        check('noHP', 'No HP Tidak Valid').isMobilePhone('id-ID')
    ],
    (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.render('edit-contact', {
                title: 'Form Update Contact',
                layout: 'layout/mainlayout',
                errors: errors.array(),
                contact: req.body
            })
        } else {
            getContacts.updateOne(
                { _id: req.body._id },
                {
                    $set: {
                        name: req.body.name,
                        email: req.body.email,
                        noHP: req.body.noHP
                    }
                }
            ).then((result) => {
                req.flash('msg', 'Data contact berhasil Diubah !')
                res.redirect('/contact')
            })
        }
    }
)


