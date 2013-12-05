if (!me || me.role !== 'admin') {
    cancel('Only an admin can update a user', 401);
}