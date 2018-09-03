class User {
    constructor() {
        this._userList = Object.create(null);
        this._userCount = 0;
        this._users = {};
    }

    addUser(socket) {
        this._userList[socket.userId] = socket;
        if (!this.isOnline(socket)) {
            this._userCount++;
            var username = socket.userData.data.username;
            this._users[username] = username;
        }
    }

    deleteUser(socket) {
        if(this._userCount > 0) {
            this._userCount--;
            delete this._users[socket.userData.data.username];
            delete this._userList[socket.userId];
        }
    }

    get users() {
        return Object.keys(this._users);
    }

    get userCount() {
        return this._userCount;
    }

    getUserData(userId) {
        return this._userList[userId];
    }

    isOnline(socket) {
        return !!this._userList[socket.userId];
    }
}

module.exports = new User();