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
const getAllReservations = function(guest_id) {
  return pool.query(`
  SELECT properties.*, reservations.*, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id 
  WHERE reservations.guest_id = $1
  AND reservations.end_date < now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT 10;
  `, [guest_id])
  .then(res => {
    console.log(res.rows);
    return res.rows
  }).catch(e => console.log(e))
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
   //1
  const queryParams = [];
  //2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  WHERE true
  `;
  //3
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `AND city LIKE $${queryParams.length} `;
  }
  //
  if (options.owner_id) {
    queryParams.push(options.owner_id);
    queryString += `AND owner_id = $${queryParams.length} `;
  }
  //
  if (options.minimum_price_per_night) {
    queryParams.push(Number(options.minimum_price_per_night)*100);
    queryString += `AND cost_per_night >= $${queryParams.length} `;
  }
  //
  if (options.maximum_price_per_night) {
    queryParams.push(Number(options.maximum_price_per_night)*100);
    queryString += `AND cost_per_night <= $${queryParams.length} `;
  }
  //
  if (options.minimum_rating) {
    queryParams.push(Number(options.minimum_rating));
    queryString += `AND rating >= $${queryParams.length} `;
  }
  //
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;
  // 
  console.log(queryString, queryParams);
  // 
  return pool.query(queryString, queryParams)
  .then(res => res.rows);
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


// SELECT properties.*, avg(property_reviews.rating) as average_rating
//   FROM properties
//   JOIN property_reviews ON properties.id = property_id
//   WHERE true
//   AND city LIKE '%ancouve%'
//   AND cost_per_night >= 500 
//   AND cost_per_night <= 1000 AND rating >= $4 
//   GROUP BY properties.id
//   ORDER BY cost_per_night
//   LIMIT $5;
//    [ '%ancouve%', 500, 1000, 3, 20 ]
