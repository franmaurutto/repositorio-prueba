//en este archivo se hace el contrato para implementar operaciones comunes de un repositorio de datos genericos

export interface Repository<T> { //importo una interfaz que establece un contrato para cualq clase q quiera actuar como repositorio d datos, la T indica que la interfaz es generica y se puede usar por cualq tipo de datos
    findAll(): T[] | undefined //me indica que findall devuelve un array por el cual se definio este repositorio o undefined
    findOne(item: { id: string }): T | undefined //findone va a recibir un parametro del tipo objeto que se llama item que tiene un id de tipo string, se exige que tenga un id y que sea un objeto 
    add(item: T): T | undefined //devuelve el elemento o undefined
    update(item: T): T | undefined
    delete(item: { id: string }): T | undefined
  }