// Se não usar o pool o banco de dados precisa sempre 
// verificar login e senha, verificar credenciais para
// fazer as pesquisa no banco de dados, não usando o metodo Pool
// toda vez que formos fazer por uma pesquisa no banco de dados,
// precisariamos de login e senha

// Com o metodo Pool conectamos apenas uma vez no banco de dados
// fazendo o banco de dados saber que temos autorização
const { Pool } = require('pg');


// Aqui colocamos as informações do nosso postgree
// Assim o banco de dados vai saber que tenho as credenciais
// para acessar o banco de dados
module.exports = new Pool({
    user: 'postgres',
    password: 'postgre',
    host: 'localhost',
    port: 5432,
    database: 'foodfy'
})
