const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const file = require('csv-parser');

const results = [];
const City2Dpt = new Map();

//Mapeo de ciudades
fs.createReadStream('Departamentos_y_municipios_de_Colombia.csv')
    .pipe(file())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        results.forEach((row) => {
            const City = row['MUNICIPIO'].normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
            const Dpt = row['DEPARTAMENTO'].normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
            console.log(City, Dpt);
            City2Dpt.set(City, Dpt);
        });
    });

app.use(cors());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    console.log('Esta running');
});

app.listen(port, () => {
    console.log(`App listening ${port}`)
});

app.get('/:city', (req, res) => {
    const City = req.params.city;
    const CityNoAccent = City.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    switch (CityNoAccent) {
        case 'bogota':
            res.send('Cundinamarca');
            break;
        case 'cartagena':
            res.send('Bolivar');
            break;
        case 'barranquilla':
            res.send('Atlantico');
            break;
        case 'santa marta':
            res.send('Magdalena');
            break;
        default:
            // obetener el departamento del map, primera letra mayus, enviar
            const Dpt = City2Dpt.get(CityNoAccent) || city;
            console.log(Dpt);
            const DptYesUpper = Dpt.charAt(0).toUpperCase() + Dpt.slice(1);
            res.send(DptYesUpper);
            break;
    }
});