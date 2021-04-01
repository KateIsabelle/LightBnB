const properties = require('./json/properties.json');
const users = require('./json/users.json');

///////////////////////////////////
 const { Pool } = require('pg');
 // 2 - set PG parameters
 const pool = new Pool({
     host: 'localhost',
     port: 5432,
     user: 'development',
     password: 'development',
     database: 'lightbnb'
 });
 // 3 - (optional ---> put the connect line to see any error or warnings for connecting)
 pool.connect((err) => {
     if (err) throw new Error(err);
     console.log('connected from the other side!');
 });
 ///////////////////////////////////

 /// Users

const getUserWithEmail = function(email) {
  return pool.query(`
  SELECT * FROM users
  WHERE email = $1
  `, [email])
  .then(res => {
    return res.rows.length ? res.rows[0] : null
  }).catch(e => console.log(e))
}
exports.getUserWithEmail = getUserWithEmail;

const getUserWithId = function(id) {
  return pool.query(`
  SELECT * FROM users
  WHERE id = $1
  `, [id])
  .then(res => {
    return res.rows.length ? res.rows[0] : null
  }).catch(e => console.log(e))
}
exports.getUserWithId = getUserWithId;

const addUser =  function(userObj) {
  return pool.query(`
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;
  `, [userObj.name, userObj.email, userObj.password])
  .then(res => {
    console.log(res.rows[0]);
    return res.rows[0]
  }).catch(e => console.log(e))
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
 const getAllProperties = function(options, limit = 10) {
  return pool.query(`
  SELECT * FROM properties
  LIMIT $1
  `, [limit])
  .then(res => {
    return res.rows;
  });
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
