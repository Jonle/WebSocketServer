class SQL {

    static log(type, error, result) {
        type = type.toUpperCase();
        if (error) {
            console.log(`[${type} ERROR] - `, error.message);
            return;
        }
        console.log(`------------${type}-----------`);
        console.log(result);
        console.log('-----------------------------\n\n');
    }

    constructor(options) {
        options = options || {};
        const mysql = require('mysql');
        this._connection = mysql.createConnection({
            host: options.host || 'localhost',
            port: options.port || '3306',
            user: options.user || 'root',
            password: options.password || '',
            database: options.database || ''
        });
        this._isConnected = false;
    }

    connect(cb) {
        if(!this._isConnected) {
            this._connection.connect((error, result) => {
                if (cb) {
                    cb.call(null, error, result);
                }
                if (error) {
                    console.log('Connect sql failed!', error.message);
                } else {
                    console.log('--sql--');
                    this._isConnected = true;
                }
            });
        } else {
            cb.call(this,null,'success');
        }

    }

    close() {
        this._connection.end();
        this._isConnected = false;
    }

    create(sql, cb) {
        this._connection.query(sql, (error, result) => {
            SQL.log('CREATE',error, result);
            cb && cb.call(this, error, result);
        });
    }

    update(sql, dataArr, cb) {
        this._connection.query(sql, dataArr, (error, result) => {
            SQL.log('UPDATE', error, result);
            cb && cb.call(this, error, result);
        });
    }

    retrieve(sql, cb) {
        this._connection.query(sql, (error, result) => {
            SQL.log('RETRIEVE', error, result);
            cb && cb.call(this, error, result);
        });
    }

    delete(sql, cb) {
        this._connection.query(sql, (error, result) => {
            SQL.log('DELETE', error, result);
            cb && cb.call(this, error, result);
        });
    }

}
module.exports = SQL;