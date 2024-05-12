//este es el repositorio que maneja a la CRUD (crear leer actualizar eliminar) para los objetos de la clase character. Se porporcionan los metodos para realizar las operaciones CRUD en character

import { Repository } from "../Shared/repository.js";
import { Character } from "./character.entity.js";

const characters = [
    new Character(
      'Darth Vader',
      'Sith',
      11,
      101,
      22,
      11,
      ['Lightsaber', 'Death Star'],
      'a02b91bc-3769-4221-beb1-d7a3aeba7dad'
    ),
]//inicializo al arreglo y este arreglo va a tener una instancia de la clase character 

export class CharacterRepository implements Repository <Character>{ //se define la clase characterrepository q implementa la interfaz repository <character>. O sea q impkementamos todos los metodos de esa interfaz
    public findAll(): Character[] | undefined {
        return characters
    }
    public findOne(item: { id: string; }): Character | undefined {
        return characters.find((character) => character.id === item.id)
    }
    public add(item: Character): Character | undefined {
        characters.push(item)
        return item
    }
    public update(item: Character): Character | undefined {
        const characterIdx = characters.findIndex((character) => character.id === item.id)

        if (characterIdx !== -1) {
          characters[characterIdx] = { ...characters[characterIdx], ...item }
        }
        return characters[characterIdx]
    }
    public delete(item: { id: string; }): Character | undefined {
        const characterIdx = characters.findIndex((character) => character.id === item.id)

        if (characterIdx !== -1) {
          const deletedCharacters = characters[characterIdx]
          characters.splice(characterIdx, 1)
          return deletedCharacters}
    }
}