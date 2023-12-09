import express from 'express';
import cors from 'cors';
import List from './mongo.js';

const port = process.env.PORT || 3001;

const app = express();

app.use(cors())
app.use(express.json());

app.use(express.static('dist'));

app.get('/list-saved', (req, res) => {
	List.find({})
		.then(lists => {
			res.json(lists);
		})
})

app.post('/list-saved', (req, res) => {
	const body = req.body;
	const {title, cat, groceryList} = body;

	let listSave = new List({
		title: title,
		category: cat,
		list: groceryList
	})

	List.find({})
		.then(lists => {
			if(lists.some(l => l.title == title)) {
				return res.status(400).json({ exist : true, text : 'El título debe se único'})
			} else {
				listSave.save()
					.then(doc => {
						return res.status(200).json({ exist : false, text : 'Se guardo la lista'});
					})
					.catch(err => console.error(err));
			}
		})
		.catch(err => console.log(err));
})

app.delete('/list-saved/:title', (req, res) => {
	let titleList = req.params.title.split('-').join(' ');

	//Eliminamos la lista y luego devolvemos todas las listas menos la eliminada
	List.findOneAndDelete({ title : titleList })
		.then(response =>  {
			List.find({})
				.then(docs => {
					res.status(200).json(docs);
				})
				.catch(err => console.error('Error al buscar las listas', err))
		})
		.catch(err => console.error(err));
})

app.listen(port, () => {
	console.log(`Servidor escuchando en el puerto ${port}`);
})