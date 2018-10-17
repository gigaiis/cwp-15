const express = require('express');
const app = express();

app.use('/api/*(fleets|vehicles|motions)', require('./routers/middleware'));
app.use('/api', require('./routers/api'));

app.listen(3000, 'localhost', () =>
{
    console.log('Wait connections');
});