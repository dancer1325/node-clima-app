const fs = require("fs");

const axios = require("axios");

class Busquedas {
    historial = []; // Variable to retrieve and updating each time the historic places search in different sessions
    dbPath = "./db/database.json"; // Static file to store the historic places searched

    constructor() {
        this.leerDB();
    }

    get historialCapitalizado() {
        return this.historial.map((lugar) => {
            let palabras = lugar.split(" ");
            palabras = palabras.map((p) => p[0].toUpperCase() + p.substring(1));

            return palabras.join(" "); // Join all the elements of the array b " "
        });
    }

    // Extract request params
    get paramsMapbox() {
        return {
            access_token: process.env.MAPBOX_KEY, // Get a environment variable
            limit: 5,
            language: "es",
        };
    }

    // Extract common query params in the weather request
    get paramsWeather() {
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: "metric",
            lang: "es",
        };
    }

    async ciudad(lugar = "") {
        try {
            // Petición http
            // Create a new instance of axios
            const intance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox,
            });

            // The response is a promise
            const resp = await intance.get();
            // .features because that's the structure of the response received
            return resp.data.features.map((lugar) => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }));
        } catch (error) {
            return [];
        }
    }

    async climaLugar(lat, lon) {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsWeather, lat, lon }, // Add several params, including longigute and latitude
            });

            const resp = await instance.get();
            const { weather, main } = resp.data; // Destructurate the response body

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp,
            };
        } catch (error) {
            console.log(error);
        }
    }

    agregarHistorial(lugar = "") {
        if (this.historial.includes(lugar.toLocaleLowerCase())) {
            return;
        }
        this.historial = this.historial.splice(0, 5); // Remove the first 5 elements in historial

        this.historial.unshift(lugar.toLocaleLowerCase()); // Add the first element of the array

        // Grabar en DB
        this.guardarDB();
    }

    guardarDB() {
        // If there are several properties to store --> Wrap it into an object
        const payload = {
            historial: this.historial, // Isn't it redundant?
        };

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    leerDB() {
        if (!fs.existsSync(this.dbPath)) return;

        const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
        const data = JSON.parse(info);

        this.historial = data.historial; // Add to the variable the previous historical cities searched
    }
}

module.exports = Busquedas;