if (!me || me.role !== 'admin' && !isMe(this.id)) {
    cancel('Only an admin can create a user', 401);
}
protect('username');