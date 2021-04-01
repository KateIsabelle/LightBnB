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

//
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

//
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

 const getAllProperties = function(options, limit = 10) {
  
  const queryParams = [];
  
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  WHERE true
  `;
  
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `AND city LIKE $${queryParams.length} `;
  }
  
  if (options.owner_id) {
    queryParams.push(options.owner_id);
    queryString += `AND owner_id = $${queryParams.length} `;
  }
  
  if (options.minimum_price_per_night) {
    queryParams.push(Number(options.minimum_price_per_night)*100);
    queryString += `AND cost_per_night >= $${queryParams.length} `;
  }
  
  if (options.maximum_price_per_night) {
    queryParams.push(Number(options.maximum_price_per_night)*100);
    queryString += `AND cost_per_night <= $${queryParams.length} `;
  }
  
  if (options.minimum_rating) {
    queryParams.push(Number(options.minimum_rating));
    queryString += `AND rating >= $${queryParams.length} `;
  }
  
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;
  
  console.log(queryString, queryParams);
  
  return pool.query(queryString, queryParams)
  .then(res => res.rows);
}
exports.getAllProperties = getAllProperties;

// 
const addProperty = function(property) {
  return pool.query(`
  INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *;
  `, [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, property.street, property.city, property.province, property.post_code, property.country, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms])
  .then(res => {
    console.log(res.rows[0]);
    return res.rows[0]
  }).catch(e => console.log(e))
}
exports.addProperty = addProperty;

