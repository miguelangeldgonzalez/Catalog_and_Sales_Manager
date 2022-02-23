class Hola{
    constructor(text){
        this.text = text;
    }

    change(){
        return this.text + " || ";
    }
}

export var hola = new Hola("Hola");