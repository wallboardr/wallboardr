if (!me || me.role !== 'admin') {
    cancel('Only an admin can create a user', 401);
}