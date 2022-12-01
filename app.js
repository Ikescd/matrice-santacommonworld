const express = require('express');
const app = express();
const port = 3000;
const { toys, categories } = require('./data');

app.use(express.json()).use(express.urlencoded({ extended: true }));

/*****************************************/
/*                 READ                  */
/*****************************************/

/*                 TOYS                  */
// getAll
app.get('/toys', (req, res) => {
	if (toys == undefined) res.sendStatus(404);
	else res.send(toys);
});
// getOne
app.get('/toys/:id', (req, res) => {
	const id = req.params.id;

	if (toys[id] == undefined) res.sendStatus(404);
	else res.send(toys[id]);
});

/*              CATEGORIES               */
// getAll
app.get('/categories', (req, res) => {
	if (categories == undefined) res.sendStatus(404);
	else res.send(categories);
});
// getOne
app.get('/categories/:id', (req, res) => {
	const id = req.params.id;

	if (categories[id] == undefined) res.sendStatus(404);
	else res.send(categories[id]);
});
// getAllToysOnOneCategorie
app.get('/categories/:category/toys', (req, res) => {
	const category = req.params.category;
	let category_id;

	// We retrieve the index of the categorie (if the categorie doesn't exist, the index will be "undefined")
	for (const index in categories) {
		if (categories[index]['name'] === category) category_id = index;
	}

	let toysWithCategories = [];
	if (category_id === undefined) {
		res.sendStatus(404);
	} else {
		// In toys array, we check if the id of the category correspond to a category_id of a toy.
		// If it's ok, we push the current toy on a new array and send it as response.
		for (const index in toys) {
			const categoryId = toys[index]['category_id'];
			if (categoryId == category_id) toysWithCategories.push(toys[index]);
		}
	}
	res.send(toysWithCategories);
});

/*****************************************/
/*                CREATE                 */
/*****************************************/

/*                 TOYS                  */
// create
app.post('/toys', (req, res) => {
	// we create a new toy to take all params from the data.
	const newToy = {
		category_id: parseInt(req.body.category_id),
		description: req.body.description,
		name: req.body.name,
		price: parseInt(req.body.price),
	};

	// if the data don't contain all params
	if (Object.keys(req.body).length < 4) {
		res.sendStatus(422);
	}
	// a perfect creation <3
	else {
		toys.push(newToy);
		res.send(toys[toys.length - 1]);
	}
});

/*              CATEGORIES               */
// create
app.post('/categories', (req, res) => {
	const newCategorie = {
		name: req.body.name,
	};

	if (Object.keys(req.body).length === 0) {
		res.sendStatus(422);
	} else {
		categories.push(newCategorie);
		res.send(categories[categories.length - 1]);
	}
});

/*****************************************/
/*                UPDATE                 */
/*****************************************/

/*                 TOYS                  */
// update
app.put('/toys/:id', (req, res) => {
	const id = req.params.id;

	// if the toy doesn't exist, we cannot modify them ;)
	if (toys[id] === undefined) {
		res.sendStatus(404);
	}
	// else, we create a newToy and replace the old with new data.
	else {
		const newToy = {
			category_id: parseInt(req.body.category_id || toys[id].category_id),
			description: req.body.description || toys[id].description,
			name: req.body.name || toys[id].name,
			price: parseInt(req.body.price || toys[id].price),
		};

		toys.splice(id, 1, newToy);
		res.send(toys[id]);
	}
});

/*              CATEGORIES               */
// update
app.put('/categories/:id', (req, res) => {
	const id = req.params.id;

	if (categories[id] === undefined) {
		res.sendStatus(404);
	} else {
		const newCategorie = {
			name: req.body.name || categories[id].name,
		};

		categories.splice(id, 1, newCategorie);
		res.send(categories[id]);
	}
});

/*****************************************/
/*                DELETE                 */
/*****************************************/

/*                 TOYS                  */
// delete one
app.delete('/toys/:id', (req, res) => {
	const id = req.params.id;

	if (toys[id] == undefined) {
		res.sendStatus(404);
	} else {
		const deletedToy = toys[id];
		toys.splice(id, 1);
		res.send(deletedToy);
	}
});
// delete all
app.delete('/toys', (req, res) => {
	toys.splice(0, toys.length);
	res.send(toys);
});

/*              CATEGORIES               */
// delete one
app.delete('/categories/:id', (req, res) => {
	const id = req.params.id;

	if (categories[id] == undefined) {
		res.sendStatus(404);
	} else {
		const deletedCategorie = categories[id];
		categories.splice(id, 1);
		res.send(deletedCategorie);
	}
});
// delete all
app.delete('/categories', (req, res) => {
	categories.splice(0, categories.length);
	res.send(categories);
});

/*            LISTEN THE PORT            */
app.listen(port, () => {});

/*****************************************/
/*                                       */
/*                 UTILS                 */
/*                                       */
/*****************************************/

/*****************************************/
/*                CREATE                 */
/*****************************************/

/** Add a toy without data
 * @command curl -X POST http://127.0.0.1:3000/toys
 * @returns 
    [
      {"category_id":0,"description":"Famous video game platform","name":"Playstation 4","price":499},
      {"category_id":null,"description":"Pink doll","name":"Barbie","price":29.99},
      {"category_id":1,"description":"Board game $$$","name":"Monopoly","price":59.99},
      {"category_id":2,"description":"A ball to play outside","name":"Football ball","price":25},
      {"category_id":1,"description":"Board game for smart children","name":"Chess","price":25}
    ]
 */

/** Add a toy with complete data (name, description, price & category_id)
 * @command curl -d "name=Minesweeper&description=Home computer classic&price=0&category_id=0" -X POST http://127.0.0.1:3000/toys
 * @returns {"category_id":0,"description":"Home computer classic","name":"Minesweeper","price":0}
 */

/** Add a toy with partial data (category_id is missing)
 * @command curl -d "name=Mario&description=Plumber Guy&price=100" -X POST http://127.0.0.1:3000/toys
 * @returns Unprocessable Entity
 */

/*****************************************/
/*                 READ                  */
/*****************************************/

/** Get all toys
 * @command curl http://127.0.0.1:3000/toys
 * @returns get all toys!
 */

/** Get an existing toy
 * @command curl http://127.0.0.1:3000/toys/1
 * @returns {"name":"Barbie","description":"Pink doll","price":29,"category_id":null}
 */

/** Get a non-exisent toy
 * @command curl http://127.0.0.1:3000/toys/5
 * @returns Not Found
 */

/*****************************************/
/*                UPDATE                 */
/*****************************************/

/** Update a param on an existing toy
 * @command curl -d "name=Checkers" -X PUT http://127.0.0.1:3000/toys/4
 * @returns {"category_id":1,"description":"Board game for smart children","name":"Checkers","price":25}
 */

/** Update two params on an existing toy
 * @command curl -d "name=Checkers&description=Dede" -X PUT http://127.0.0.1:3000/toys/4
 * @returns {"category_id":1,"description":"Dede","name":"Checkers","price":25}
 */

/** Update a param on a non-existent toy
 * @command curl -d "name=Checkers" -X PUT http://127.0.0.1:3000/toys/5
 * @returns Not Found
 */

/*****************************************/
/*                DELETE                 */
/*****************************************/

/** Delete a toy
 * @command curl -X DELETE http://127.0.0.1:3000/toys/4
 * @returns {"category_id":1,"description":"Board game for smart children","name":"Chess","price":25}
 */
