const query = require("./query");

const NAME_QUOTE = "`";
const SEPARATOR = ",";

function quote(key) {
  return NAME_QUOTE + key + NAME_QUOTE;
}

class Repository {
  constructor(name) {
    this.name = name;
  }

  create(object) {
    const keys = Object.keys(object).map(quote).join(SEPARATOR);
    const values = Object.values(object);
    const placeholders = values.map(r => '?').join(SEPARATOR);
    return query(`insert into ${NAME_QUOTE}${this.name}${NAME_QUOTE}(${keys}) values (${placeholders})`, values);
  }

  update(id, object) {
    const settings = Object.keys(object).map(key => NAME_QUOTE + key + NAME_QUOTE + " = ?").join(SEPARATOR);
    return query(`update ${NAME_QUOTE}${this.name}${NAME_QUOTE} set ${settings} where id = ?`, [...Object.values(object), id]);
  }
}

Repository.quote = quote;
Repository.query = query;

module.exports = Repository;
