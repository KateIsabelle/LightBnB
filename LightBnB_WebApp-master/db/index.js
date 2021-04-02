const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'development',
    password: 'development',
    database: 'lightbnb'
});
//optional ---> put the connect line to see any error or warnings for connecting
pool.connect((err) => {
    if (err) throw new Error(err);
    console.log('connected from the other side!');
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  },
}
