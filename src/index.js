const express = require('express');
const app = express();
app.use(express.json());
const axios = require('axios');

const ingressosPorClienteId = {};
const {  v4: uuidv4 } = require('uuid');

app.post('/clientes/:id/ingressos', async (req, res) => {
    const idObs = uuidv4();
    const {
        texto
    } = req.body;
    
    const ingressosDoCliente =
        ingressosPorClienteId[req.params.id] || [];
        ingressosDoCliente.push({
        id: idObs,
        texto
    });
    ingressosPorClienteId[req.params.id] =
        ingressosDoCliente;
    await axios.post('http://localhost:10000/eventos', {
        tipo: "IngressoCriado",
        dados: {
            id: idObs,
            texto,
            clienteId: req.params.id
        }
    })
    res.status(201).send(ingressosDoCliente);
});
app.get('/clientes/:id/ingressos', (req, res) => {
    res.send(ingressosPorClienteId[req.params.id] || []);

});

app.listen(5000, () => console.log('Ingressos. Porta 5000') );