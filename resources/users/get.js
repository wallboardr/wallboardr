if (!me || (me.role !== 'admin' && !isMe(this.id))) {
    cancel('Only an admin can fetch user information', 401);
}