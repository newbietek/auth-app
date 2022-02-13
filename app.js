const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;
const { auth } = require('./middlewares/authorization');
const User = require('./models/User.model');

require('./repositories/mongo').mongoConnect();

const express = require('express');
const app = express();
app.use(express.json());
app.use(cookieParser());

app.get('/', async (req, res) => {
	res.status(200).send('<h1>Welcome to Auth App</h1>');
});

app.post('/register', async (req, res) => {
	const { firstname, lastname, email, password } = req.body;
	if (!(firstname && lastname && email && password)) {
		res.status(400).send('Missing name, email or password');
	}

	const user = await User.find({ email }).exec();
	if (user) {
		return res.status(400).send('Email is already registered');
	}

	const encryptedPassword = await bcrypt.hash(password, 10);
	const newUser = new User({
		firstName: firstname,
		lastName: lastname,
		email,
		password: encryptedPassword,
	});
	const createdUser = await newUser.save();
	createdUser.password = undefined;
	res.status(200).json(createdUser);
});

app.post('/login', async (req, res) => {
	const { email, password } = req.body;
	if (!(email && password)) {
		return res.status(400).send('Missing email or password');
	}

	const user = await User.findOne({ email }).exec();
	if (!(user && (await bcrypt.compare(password, user.password)))) {
		return res.status(401).send('Invalid username or password');
	}
	const u = {
		firstname: user.firstname,
		lastname: user.lastname,
		email: user.email,
	};

	token = jwt.sign(u, JWT_SECRET, { expiresIn: '2d' });

	return res
		.status(200)
		.cookie('token', token, {
			expiresIn: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
			httpOnly: true,
		})
		.json({ token });
});

app.post('/logout', async (req, res) => {
	res.clearCookie('token');
	return res.status(200).send('Logged out successfully');
});

app.get('/sensitive', auth, async (req, res) => {
	return res.status(200).send('<h1>This is confidential</h1>');
});

module.exports = app;
