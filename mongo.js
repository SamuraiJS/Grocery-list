import mongoose, {Schema, model} from 'mongoose';
import 'dotenv/config';

const uri = process.env.MONGODB_URL;

mongoose.connect(uri)
	.then(result => console.log('Se conectó con éxito a la DB'))
	.catch(err => console.error('Hubo un error al conectarse a la DB', err));

const listSchema = new Schema({
	title: String,
	category: String,
	list: Array
});

//Formatear Esquema

listSchema.set('toJSON', {
	transform : (doc, returnedObj) => {
		returnedObj._id = returnedObj._id.toString();
		delete returnedObj._id;
		delete returnedObj.__v;
	}
})

const List = model('List', listSchema);

export default List;