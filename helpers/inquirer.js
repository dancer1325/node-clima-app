const inquirer = require("inquirer");
require("colors");

// Inquirer.question
const preguntas = [{
    type: "list",
    name: "opcion",
    message: "¿Qué desea hacer?",
    choices: [{
            value: 1,
            name: `${"1.".green} Buscar ciudad`,
        },
        {
            value: 2,
            name: `${"2.".green} Historial`,
        },
        {
            value: 0,
            name: `${"0.".green} Salir`,
        },
    ],
}, ];

const inquirerMenu = async() => {
    console.clear();
    // console.log(process.argv);
    // console.log(process.env);
    console.log("==========================".green);
    console.log("  Seleccione una opción".white);
    console.log("==========================\n".green);

    // Destructure, getting just the field by 'name' with the value selected
    const { opcion } = await inquirer.prompt(preguntas);

    return opcion;
};

const pausa = async() => {
    // Inquirer.question
    const question = [{
        type: "input",
        name: "enter",
        message: `Presione ${"enter".green} para continuar`,
    }, ];

    console.log("\n");
    await inquirer.prompt(question);
};

const leerInput = async(message) => {
    // Inquirer.question
    const question = [{
        type: "input",
        name: "desc",
        message,
        validate(value) {
            // Function to validate the user input
            if (value.length === 0) {
                return "Por favor ingrese un valor";
            }
            return true;
        },
    }, ];
    // Destructure, getting just the field by 'name' with the value selected
    const { desc } = await inquirer.prompt(question);
    return desc;
};

// Indicate that the argument is an array to be able to map afterwards
const listarLugares = async(lugares = []) => {
    const choices = lugares.map((lugar, i) => {
        const idx = `${i + 1}.`.green;

        return {
            value: lugar.id,
            name: `${idx} ${lugar.nombre}`,
        };
    });
    // Introduce a new element at the start of the array
    choices.unshift({
        value: "0",
        name: "0.".green + " Cancelar",
    });
    // Inquirer.question
    const preguntas = [{
        type: "list",
        name: "id",
        message: "Seleccione lugar:",
        choices,
    }, ];
    // Destructure, getting just the field by 'name' with the value selected
    const { id } = await inquirer.prompt(preguntas);
    return id;
};

const confirmar = async(message) => {
    // Inquirer.question
    const question = [{
        type: "confirm",
        name: "ok",
        message,
    }, ];
    // Destructure, getting just the field by 'name' with the value selected
    const { ok } = await inquirer.prompt(question);
    return ok;
};

const mostrarListadoChecklist = async(tareas = []) => {
    const choices = tareas.map((tarea, i) => {
        const idx = `${i + 1}.`.green;

        return {
            value: tarea.id,
            name: `${idx} ${tarea.desc}`,
            checked: tarea.completadoEn ? true : false,
        };
    });
    // Inquirer.question
    const pregunta = [{
        type: "checkbox",
        name: "ids",
        message: "Selecciones",
        choices,
    }, ];
    // Destructure, getting just the field by 'name' with the value selected
    const { ids } = await inquirer.prompt(pregunta);
    return ids;
};

module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmar,
    mostrarListadoChecklist,
};