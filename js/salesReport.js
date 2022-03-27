import {s, get} from './app.js';
import { getUser } from './utilities.js';

const DIR = "php/sales_report/";

getUser(user => {
    if(user.range < 2){
        window.location = "devices.html"
    }
})

get(DIR + "get_all_sales.php", response => {
    let dates = [];

    response.real_state.forEach(element => {
        dates.push(element.date);
    });

    let data = [];

    response.real_state.forEach(element => {
        data.push(element.sell_cost);
    });

    var graph = s("#graph").getContext("2d");

    var chart = new Chart(graph, {
        type: "line",
        data: {
            labels: dates,
            datasets: [
                {
                    label: "Ventas de inmuebles",
                    backgroundColor: "rgb(34,45,34)",
                    borderColor: "rgb(23,23,23)",
                    data: data
                }
            ]
        },
        options: {
            maintainAspectRatio: false
        }
    });

    dates = [];

    response.devices.forEach(element => {
        dates.push(element.date);
    });

    data = [];

    response.devices.forEach(element => {
        data.push(element.cost);
    });

    var graph = s("#graph2").getContext("2d");

    var chart2 = new Chart(graph2, {
        type: "line",
        data: {
            labels: dates,
            datasets: [
                {
                    label: "Ventas de celulares",
                    backgroundColor: "rgb(100,100,100)",
                    borderColor: "rgb(23,23,23)",
                    data: data
                }
            ]
        },
        options: {
            maintainAspectRatio: false
        }
    });
}, true)