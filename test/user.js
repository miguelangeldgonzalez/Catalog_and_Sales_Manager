/*import { getUser } from "./../js/utilities.js";
import {s} from "./../js/app.js";

let canva = s("#grafica").getContext("2d");

var chart = new Chart(canva, {
    type: "line",
    data: {
        labels: ['Vino', 'Tekila', 'Ron'],
        datasets: [
            {
                label: "Grafica de bebidas",
                backgroundColor: "rgb(34,45,34)",
                borderColor: "rgb(23,23,23)",
                data: [12, 39, 5, 30]
            }
        ]
    },
    options: {
        maintainAspectRatio: false
    }
});*/

/*class Vehiculo{
    constructor(){
        this.peso;
        this.velocidad = 0;
    }

    acelerar(){
        console.log("Este clase no se puede acelerar, pero las instacias si");
    }
}

class Carro extends Vehiculo{
    constructor(){
        super();
        this.velocidad = 120;
        this.peso = 2000;

    }

    acelerar(){
        this.__proto__.acelerar();
        console.log("El carro ha acelerado a una velocidad de " + this.velocidad + "km/h");
    }
}

class Moto extends Vehiculo{
    constructor(){
        super();
        this.velocidad = 60;
        this.peso = 300;
    }

    acelerar(){
        console.log("La moto ha acelerado a una velocidad de " + this.velocidad + "km/h");
    }
}

var carro = new Carro();
carro.acelerar();

var moto = new Moto();
moto.acelerar();*/

class Multiplicar{
    constructor(a, b){
        this.a = a;
        this.b = b;

        this.c = a * b;
    }

    imprimirResultado(){
        console.log(`${this.a} x ${this.b} = ${this.c}`);
    }
}

class Cuadrado{
    constructor(lados){
        this.lados = lados;
        this.area = lados * 2;
    }

    getValues(){
        return {lados: this.lados, area: this.area};
    }
}

class Cubo extends Cuadrado{
    constructor(lados){
        super(lados);
        this.lados = lados;
    }

    getValues(){
        return {
            lados: this.lados,
            area: this.area,
            volumen: this.lados ** 3
        }
    }
}

let c = new Cubo(12);

console.log(c.getValues());