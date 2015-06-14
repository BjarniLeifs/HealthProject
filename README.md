
# Install dependencies

	windows: npm install -d
	Unix: sudo npm install -d

# Running the database

	Windows: mongod.exe --dbpath <path to DB>
	unix: sudo mongod --dbpath <path to DB>
	
	example : sudo mongod --dbpath /data/db     <--- for default path of mongodb.

# How to setup matis database in mongo
	
	Windows: mongoimport.exe --db jBerry --collection matis --file \path\to\foods.json --jsonArray
	unix: mongoimport --db jBerry --collection matis --file /path/to/foods.json --jsonArray

	notice: you must be running mongod when you run mongoimport.exe
	

# Running the server

	notice: you must run MongoDB before running the express server.

## Run grunt task and server:

	grunt

The grunt command concats the JS and CSS files, runs JSHint and runs the server at port 3000 (default)
