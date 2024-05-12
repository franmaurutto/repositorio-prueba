import express, { NextFunction, Request, Response } from 'express' //se importa el modulo express q es un framework web para nodejs
import { Character } from './character/character.entity.js';
import { CharacterRepository } from './character/character.repository.js'; //importamos las clases character y characterrepository

const app = express() //creamos una instancia de express llamada app
app.use(express.json()) //este es el middleware que necesitamos para q express pueda parsear el cuerpo de las solicitudes en formato json

// nos comunicamos entre el front y el back utilizando recursos que son los verbos de http: get (obtenemos info sobre los recursos), post (creamos nuevos recursos), delete (borrar recursos), put y patch
//un recurso es el character, cada uno de estos recursos tiene que poder ser accedido. Para poder determinar el recurso que se quiere acceder hago: /api/characters/  . Si hago un get a esa ruta vamos a obtener una lista de los characters.
// get /api/characters/:id vamos a obtener el character id = :id
// post /api/characters/ vamos a crear un nuevo character
//delete /api/characters/:id vamos a borar ese recurso character donde vamos a tener que decir cual es el character id
//put o patch /api/characters/:id vamos a modificar el character con id = :id
//para indicarle estas acciones a la api lo hago de la siguiente forma que no es la mejor pero es la mas simple

const repository=new CharacterRepository() // Se crea una instancia del repositorio de personajes.


const characters = [
    new Character(
      'Darth Vader',
      'Sith',
      10,
      100,
      20,
      10,
      ['Lightsaber', 'Death Star'],
      'a02b91bc-3769-4221-beb1-d7a3aeba7dad'
    ),
  ]

//req (abreviatura de request) es un objeto que contiene información sobre la solicitud HTTP que llega al servidor. Contiene datos como los parámetros de la URL, los encabezados, el cuerpo de la solicitud y cualquier otra información relacionada con la solicitud realizada por el cliente. res (abreviatura de response) es un objeto que se utiliza para enviar una respuesta al cliente que realizó la solicitud. Contiene métodos y propiedades que permiten configurar y enviar la respuesta al cliente, incluyendo el código de estado HTTP, los encabezados de respuesta y el cuerpo de la respuesta.

function sanitezeCharacterInput(req: Request, res: Response, next :NextFunction) {//este es el codigo q se usa para limpiar y validar los datos donde se agregan los datos sanitizados al objeto req.body.sanitizedInput
  
  req.body.sanitizedInput= {
    name: req.body.name,
    characterClass: req.body.characterClass,
    level: req.body.level,
    hp: req.body.hp,
    mana: req.body.mana,
    attack: req.body.attack,
    items: req.body.items,
  }
  //aca tendriamos que verificar por ej el tipo de datos y otras cosas
  Object.keys(req.body.sanitizedInput).forEach((key) => { //para cada propiedad del objeto vamos a quitar el elemento que no queremos pero solo si este elemento es undefined
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}
//la funcion next se va a invocar al final de nuestro codigo, cuando tenemos un middleware nos procesa lo que tenemos en la funcion y sigue con el analisis de las rutas  
app.get ('/api/characters', (req,res)=>{
    res.json({data: repository.findAll()})
})

app.get ('/api/characters/:id', (req,res)=>{
  const id= req.params.id // Obtiene el ID del personaje de los parámetros de la URL.
  const character = repository.findOne({id})  // Busca un personaje por su ID en el repositorio.
  if(!character){
    res.status(404).send({message: 'Character not found'})
  } //si no se encuentra el character, vamos a dar un mensaje de error 404
  res.json(character)//aca se devuelve le personaje si se encuentra
}) //para relacionar la ruta con la que vamos a obtener un character especifico donde se espera que en la ruta se incluya una variable id que vamos a recibir en nuestra request donde se va a buscar en nuestra lista de personajes

//aca en vez de venir la informacion en el caso del get con el id que venia como un parametro en la ruta, aca viene dado en el cuerpo de la peticion en characters.http. Esta info la vamos a tener disponibole en req.body pero vamos a necesitar un middleware que forme al body para poder dsp pasar la info al post o al put o patch
app.post('/api/characters', sanitezeCharacterInput,(req,res)=>{
  const input= req.body.sanitizedInput //de esta forma obtengo los elementos que necesito para el req.body
  const characterInput = new Character(input.name, input.characterClass, input.level, input.hp, input.mana, input.attack, input.items) //creamos nuestro nuevo character con esta info que se nos provee
  const character = repository.add(characterInput) //lo agregamos al contenido de nuestra coleccion
  res.status(201).send({message: 'Character created', data: character})//retornamos el status 201 que indica que se creo el recurso y ademas respondemos el mensaje ese
})


app.put('/api/characters/:id', sanitezeCharacterInput,(req,res)=> {
  req.body.sanitizedInput.id=req.params.id
  const character= repository.update(req.body.sanitizedInput)

  if(!character){ //si no lo encuentro muestro el sig mensaje
    return res.status(404).send({message: 'Character not found'}) //no es necesario la funcion de retorno
  }
   return res.status(200).send({message: 'Character updated successfully', data: characters})
})


app.patch('/api/characters/:id', sanitezeCharacterInput,(req,res)=> {
  req.body.sanitizedInput.id=req.params.id
  const character= repository.update(req.body.sanitizedInput)

  if(!character){ //si no lo encuentro muestro el sig mensaje
    return res.status(404).send({message: 'Character not found'})
  }
   return res.status(200).send({message: 'Character updated successfully', data: characters})
})


app.delete('/api/characters/:id', (req, res) => {
  const id=req.params.id
  const character =repository.delete({id})

  if (!character) {
    res.status(404).send({ message: 'Character not found' })
  } else {
    res.status(200).send({ message: 'Character deleted successfully' })
  }
})

app.use((_, res) => { //como no usamos la solicitud en el middleware se usa el guion bajo, no la necesito en mi logica
  return res.status(404).send({ message: 'Resource not found' }) // Manejo de solicitudes a rutas no definidas
})

app.listen (3000, ()=>{
    console.log("Server running on http: //localhost:3000/")
});//aca lanzamos nuestro servicio http y seteamos el servidor que queremos que se escuche
