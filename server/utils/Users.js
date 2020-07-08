class Users {
    constructor() {
        this.users = [];
    }

    addUser(id, username, room) {
        const user = { id, username, room };
        this.users.push(user);
        return user;
    }

    removeUser(id) {
        const user = this.getUser(id);

        if (user) {
            this.users = this.users.filter((user) => user.id !== id);
        }
        return user;
    }

    getUser(id) {
        const user = this.users.find((user) => user.id === id);
        return user;
    }

    getUserList(room) {
        const filteredResult = this.users.filter((user) => user.room === room);
        const userDetails = filteredResult.map((user) => {
            return {
                id: user.id,
                username: user.username,
            };
        });
        return userDetails;
    }
}

module.exports = Users;
