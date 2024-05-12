import crypto from 'node:crypto' //lo importamos para geerar un id unico de character


export class Character{
    constructor(public name:string, public characterClass:string, public level:number, public hp:number, public mana:number, public attack:number, public items: string [], public id= crypto.randomUUID()){} // con el metodo crypto.randomUUID se genera el id para el personaje. El id es opcional y se asigna automaticamente si no se proporciona cuando creo la instancia del personaje
}