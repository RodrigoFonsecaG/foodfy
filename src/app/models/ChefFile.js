const db = require('../../config/db');

module.exports = {
  all(){
    const query = `SELECT files.*, chefs.file_id
    FROM files
    LEFT JOIN chefs ON (files.id = chefs.file_id)`

    return db.query(query)
  },
    find(id){
      const query = `SELECT * FROM files WHERE id = ${id}
      `

      return db.query(query);
    }
}