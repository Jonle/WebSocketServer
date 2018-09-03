const CONST = require('../src/const');
const CODE = CONST.code;
const INFO = CONST.info;
const SQL = require('../src/sql');
let user = require('../src/user');
let tableName = 'user';
module.exports = {
    connectSql: (mysql, socket) => {
        if(user.isOnline(socket)) {
            let info = {code: CODE.CONFLICT, message: INFO.ERROR_USER_ONLINE};
            socket.send(JSON.stringify(info));
            return new Promise((resolve, reject) => {
                socket ? resolve(socket.userId) : reject();
            });
        } else {
            return new Promise((resolve, reject) => {
                let userData = socket.userData;
                let selectSql = SQL.selectSql('*', tableName, `WHERE name='${userData.data[0]}'`);
                mysql.retrieve(selectSql).then((result) => {
                    let info = null;
                    let userId = null;
                    if (userData.eventType === 'signup') {
                        info = {code: CODE.CONFLICT, message: INFO.ERROR_USER_CONFLICT};
                    } else if (userData.eventType === 'signin') {
                        if (result[0].password === userData.data[1]) {
                            userId = result[0].id;
                            socket.userId = userId;
                            info = {code: CODE.SUCCESS, message: INFO.ERROR_NONE, id: userId};
                        } else {
                            info = {code: CODE.FAILED, message: INFO.ERROR_PASSWORD};
                        }
                    }
                    userId !== null ? resolve(userId):reject();
                    socket.send(JSON.stringify(info));

                }, () => {
                    let userId = null;
                    if (userData.eventType === 'signup') {
                        let insertSql = SQL.insertSql(tableName, ['name', 'password'], userData.data);
                        mysql.create(insertSql).then((result) => {
                            userId = result.insertId;
                            socket.userId = userId;
                            let info = {code: CODE.SUCCESS, message: INFO.ERROR_NONE, id: userId};
                            userId !== null ? resolve(userId):reject();
                            socket.send(JSON.stringify(info));
                        }, () => {
                            let info = {code: CODE.FAILED, message: INFO.ERROR_SIGN_UP};
                            userId !== null ? resolve(userId):reject();
                            socket.send(JSON.stringify(info));
                        });
                    } else if (userData.eventType === 'signin') {
                        let info = {code: CODE.FAILED, message: INFO.ERROR_USER_NAME};
                        userId !== null ? resolve(userId):reject();
                        socket.send(JSON.stringify(info));
                    }
                });
            });
        }
    },

    broadcast: (socketServer, eventType, socket) => {
        let userId = socket.userId;
        let userData = socket.userData;
        socketServer.clients.forEach((client) => {
            let data = {
                eventType: eventType,
                data: '',
                onlineCount: user.userCount,
                onlineUsers: user.users
            };
            switch (eventType) {
                case 'login':
                    data.data = {username: userData.data.username, userId: userId};
                    break;
                case 'logout':
                    data.data = {username: userData.data.username, userId: userId};
                    break;
                case 'message':
                    data.data = {username: userData.data.username, userId: userId, content: userData.data.content};
                    break;
            }
            if (client.readyState === 1) {
                client.send(JSON.stringify(data));
            }

        })
    }
};