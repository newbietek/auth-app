const mongoose = require('mongoose');

const { MONGO_URL } = process.env;

exports.mongoConnect = () => {
	mongoose
		.connect(MONGO_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then((db) => {
			console.info('MONGO DB CONNECTED SUCCESFULLY');
			//Connection event handler
			db.connection.on('error', (err) => {
				console.error(err);
			});
			db.connection.on('disconnected', () => {
				console.log('disconnected');
			});
			db.connection.on('reconnected', () => {
				console.log('reconnected');
			});
		})
		.catch((err) => {
			console.error('MONGO CONNECTION FAILED', err);
			process.exit(1);
		});
};
