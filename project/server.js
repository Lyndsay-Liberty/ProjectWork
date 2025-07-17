require('dotenv').config();
const express = require('express');
const path = require('path');
const da = require("./data-access");
const mw = require("./middleware");
const bodyParser = require('body-parser');
const { requireApiKey, apikeyRoute } = require('./middleware');
const app = express();
const port = 4000;

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.get("/customers", mw.requireApiKey, async (req, res) => {
     const cust = await da.getCustomers();
     console.log(cust);
     if(cust){
         res.send(cust);
     }else{
         res.status(500);
         res.send(err);
     }   
});
app.get("/reset", async (req, res) => {
    const [result, err] = await da.resetCustomers();
    if(result){
        res.send(result);
    }else{
        res.status(500);
        res.send(err);
    }   
});

app.post('/customers', async (req, res) => {
    const newCustomer = req.body;
    if (newCustomer === null || req.body == {}) {
        res.status(400);
        res.send("missing request body");
    } else {
        // return array format [status, id, errMessage]
        const [status, id, errMessage] = await da.addCustomer(newCustomer);
        if (status === "success") {
            res.status(201);
            let response = { ...newCustomer };
            response["_id"] = id;
            res.send(response);
        } else {
            res.status(400);
            res.send(errMessage);
        }
    }
});
app.get("/customers/:id", async (req, res) => {
     const id = req.params.id;
     // return array [customer, errMessage]
     const [cust, err] = await da.getCustomerById(id);
     if(cust){
         res.send(cust);
     }else{
         res.status(404);
         res.send(err);
     }   
});

app.put('/customers/:id', async (req, res) => {
    const id = req.params.id;
    const updatedCustomer = req.body;
    if (updatedCustomer === null || req.body == {}) {
        res.status(400);
        res.send("missing request body");
    } else {
        delete updatedCustomer._id;
        // return array format [message, errMessage]
        const [message, errMessage] = await da.updateCustomer(updatedCustomer);
        if (message) {
            res.send(message);
        } else {
            res.status(400);
            res.send(errMessage);
        }
    }
});

app.delete("/customers/:id", async (req, res) => {
    const id = req.params.id;
    // return array [message, errMessage]
    const [message, errMessage] = await da.deleteCustomerById(id);
    if (message) {
        res.send(message);
    } else {
        res.status(404);
        res.send(errMessage);
    }
});
app.get('/apikey', apikeyRoute);

// Protect endpoints as needed:
app.get('/protected', requireApiKey, (req, res) => {
  res.send('You accessed a protected endpoint!');
});
