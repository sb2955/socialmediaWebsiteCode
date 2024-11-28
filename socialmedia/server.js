const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const multer = require('multer');
const paths = require('path');
const application = express();
const PORT =5500;
const key = '12345';

//Middleware to serve files which has been uploaded ,parsing incoming data,allowing cross-origin resource sharing and serving static files from the "allinuse" folder
application.use(cors());
application.use(bodyParser.json());
application.use(express.static('allInUse'));
application.use('/uploadContent', express.static('uploadContent'));

//The configuration of mongoDB compass (GUI)
const url = 'mongodb://127.0.0.1:27017';
const databaseName = 'cooking_hub';
let database;

MongoClient.connect(url, { useUnifiedTopology: true})
.then(client => {
    console.log('Successful connection to MongoDB');
    database= client.database(databaseName);

})
.catch(error => console.error(error));

//The configuration of multer for uploading photos
const storeImg = multer.diskStorage( {
    destination: (req, file, cb) => cb(null, 'uploadContent'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.name))
});

const uploadingContent = multer({storeImg});

//The URL Routes
application.get('/:userID/:actions', (req,res) => {
    const { userID, actions} = req.params;

    if (actions === 'login'  || actions === 'register') {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }else{
        res.status(404).send('Error. Not supported version')
    }
});

// Authentication Route for the user 
application.post('/signup', async (req, res) => {
    try {
        const { username, email, password} = req.body;
        const passwordhash = await bcrypt.hash(password, 10);
        const onlineUser = { username, email, password: passwordhash};

        await database.collection('onlineUsers').insertOne(onlineUser);
        res.status(201).json({ message: 'This account was registered successfully'});
    } catch(error) {
        res.status(500).json( { error: error.message});
    }
});

application.post('/signin', async (req, res) => {
    try {
        const { email, password} = req.body;
        const onlineUser = await database.collection('onlineUsers').findOne({ email});

        if( !onlineUser || !(await bcrypt.compare(password, onlineUser.password))) {
            return res.status(401).json({ error: 'Invalid.Enter the correct email or password'});
        }

        const token = jwt.sign({ userID: onlineUser_ID}, key, {elimnate: '1d'});
        res.status(200).json({ token, onlineUser: { id: onlineUser_ID, username: onlineUser.username}});
    }catch (error) {
        res.status(500).json({ error: error.message});
    }
    
});

// the routes for the posting of content
application.post('/onlinePost', upload.single('photo'), async (req, res) => {
    try {
        const { userID, title, about } = req.body;
        const photoUrl = req.file ? `/uploadContent/${req.file.filename}` : null;

        const publication = { userID, title, about, photoUrl, likes: [], comments: [], postAt: new Date()};
        await database.collection('onlinePost').insertOne(publication);
        res.status(201).json(publication);
    }catch (error) {
        res.status(500).json({ error: error.message});
    }
});

application.get('/onlinePost', async (req, res) => {
    try {
        const onlinePosts = await database.collection('onlinePost').find().sort({ postAt: -1}).toArray();
        res.status(200).json(onlinePosts);
    }catch (error) {
        res.status(500).json({ error: error.message});
    }
});

application.listen(PORT, () => console.log(`sercer running at http://localhost:${PORT}`));

