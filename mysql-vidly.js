const config = require('config');
const mysql = require('mysql2/promise');

async function connectToMySQL() {
    try{
        return await mysql.createConnection({
            host:`${config.get('database.host')}`, 
            user: `${config.get('database.user')}`, 
            database: 'vidlydb'
        });
        //console.log('Connected to Database...')
    }catch(err){
        console.error("Couldn't connect to Database...", err.message )
    }
}






module.exports = connectToMySQL;



 const [rows, fields] = await connection.execute('SELECT * FROM `table` WHERE `name` = ? AND `age` > ?', ['Morty', 14]);
