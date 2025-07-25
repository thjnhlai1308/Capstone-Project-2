const client = require('./client')
const path = require('path')
const fs = require('fs')
const {
  createUser
} = require('./user')

const {
  createShoe
} = require('./shoes')

const {
  createFavorite
} = require('./favorites')


const seed = async()=> {
  const SQL = `
    DROP TABLE IF EXISTS favorites;
    DROP TABLE IF EXISTS user_shoes;
    DROP TABLE IF EXISTS shoes;
    DROP TABLE IF EXISTS users;
    
    CREATE TABLE users(
      id UUID PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100),
      is_Oauth Boolean DEFAULT false,
      CHECK((password IS NOT NULL AND is_Oauth = false) OR (password IS NULL AND is_Oauth = true)),
      is_admin Boolean DEFAULT false NOT NULL 
    );
      
    CREATE TABLE shoes (
      id UUID PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL
    );
    
    CREATE TABLE favorites (
      id UUID PRIMARY KEY,
      shoe_id UUID REFERENCES shoes(id) NOT NULL,
      user_id UUID REFERENCES users(id) NOT NULL,
      CONSTRAINT shoe_and_user_id UNIQUE(shoe_id, user_id)
    );
  `
  await client.query (SQL)

  const [sneakers, boots, loafer, clog] = await Promise.all([
    createShoe({name: 'sneakers'}),
    createShoe({name: 'boots'}),
    createShoe({name: 'loafer'}),
    createShoe({name: 'clog'})
  ])

  const [andy1, kev1324, thjnhlai1308] = await Promise.all([
    createUser({username: 'andy1', password: '1234', is_admin: false}),
    createUser({username: 'kev1324', password: 'kkevv123', is_admin: false}),
    createUser({username: 'thjnhlai1308', password: 'Thinhlai2025', is_admin: true})
  ])

  await Promise.all([
    createFavorite({user_id: andy1.id, shoe_id: sneakers.id}),
    createFavorite({user_id: kev1324.id, shoe_id: loafer.id})
  ])


  console.log("created tables and seeded data")
};



module.exports = {
  client,
  seed
};