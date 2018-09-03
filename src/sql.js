class SQL {

    static log(type, error, result) {
        type = type.toUpperCase();
        if (error) {
            console.log(`[${type} ERROR] - `, error.message);
            return;
        }
        console.log(`------------${type}-----------`);
        console.log(result);
        console.log(`----------${type}--END--------\n\n`);
    }

    /***
     * @param {String} columnName  列(字段)名(*)
     * @param {String} tableName   表名
     * @param {String} [condition]  条件
     * @returns {string}
     */
    static selectSql(columnName,tableName,condition) {
        if(condition) {
            return `SELECT ${columnName} FROM ${tableName} ${condition};`;
        }
        return `SELECT ${columnName} FROM ${tableName};`;
    }

    /***
     * @param {String} tableName
     * @param {Array} columnNames 插入的列(字段)名
     * @param {Array} values      对应列(字段)名的值
     * @return {String}
     */
    static insertSql(tableName,columnNames,values) {
        values = values.map(function (value) {
            if(typeof value === 'string') {
                return "'"+value+"'";
            }
            return value;
        });
        return `INSERT INTO ${tableName}(${columnNames.join(',')}) VALUES(${values.join(',')});`;
    }

    /***
     * @param {String} tableName
     * @param {Array} columnNames 插入的列(字段)名
     * @param {String} condition
     * @return {String}
     */
    static updateSql(tableName,columnNames,condition) {
        let tempArr = [`UPDATE ${tableName} SET `];
        let columns = columnNames.join('=?,')+ '=? ';
        tempArr.push(columns);
        tempArr.push(condition);
        tempArr.push(';');
        return tempArr.join('');
    }

    /***
     * @param {String} tableName
     * @param {String} condition
     * @return {String}
     */
    static deleteSql(tableName,condition) {
        return `DELETE FROM ${tableName} ${condition}`;
    }

    /***
     * @param {String} sqlModule
     * @param options
     */
    constructor(sqlModule,options) {
        options = options || {};
        const sql = require(sqlModule);
        this._pool = sql.createPool({
            host: options.host || 'localhost',
            port: options.port || '3306',
            user: options.user || 'root',
            password: options.password || '',
            database: options.database || ''
        });
    }
    create(sql) {
        return new Promise((resolve, reject) => {
            this._pool.getConnection(function (error,connect) {
                if(error) {

                } else {
                    connect.query(sql, (error, result) => {
                        SQL.log('CREATE', error, result);
                        error ? reject(error) : resolve(result);
                        connect.release();
                    });
                }
            });
        });
    }

    update(sql, dataArr) {
        return new Promise((resolve, reject) => {
            this._pool.getConnection(function (error,connect) {
                if(error) {

                } else {
                    connect.query(sql, dataArr, (error, result) => {
                        SQL.log('UPDATE', error, result);
                        error || result.length === 0 ? reject(error) : resolve(result);
                        connect.release();
                    });
                }
            });
        });
    }

    retrieve(sql) {
        return new Promise((resolve, reject) => {
            this._pool.getConnection(function (error,connect) {
                if(error) {

                } else {
                    connect.query(sql, (error, result) => {
                        SQL.log('RETRIEVE', error, result);
                        error || result.length === 0 ? reject(error) : resolve(result);
                        connect.release();
                    });
                }
            });
        });
    }

    delete(sql) {
        return new Promise((resolve, reject) => {
            this._pool.getConnection(function (error,connect) {
                if(error) {

                } else {
                    connect.query(sql, (error, result) => {
                        SQL.log('DELETE', error, result);
                        error || result.length === 0 ? reject(error) : resolve(result);
                        connect.release();
                    });
                }
            });
        });
    }
}
module.exports = SQL;