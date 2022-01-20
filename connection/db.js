
const {Pool}=require('pg');//import postgre

const dbpool= new Pool({
    database: 'personal_web_b30',
    port: 5432,
    user: 'postgres',
    password: 'Dhyno123'
});
module.exports=dbpool;