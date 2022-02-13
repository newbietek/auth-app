const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

exports.auth = (req, res, next) => {
	const token = req.cookies.token || req.headers.authorization;
	const user = jwt.decode(token);
	if (!user) {
		return res.status(401).send('Missing or Invalid token');
	}
	req.body.user = user;

	next();
};
