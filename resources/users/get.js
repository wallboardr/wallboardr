if (!me || me.role !== 'admin') {
    cancel('Only an admin can fetch user information', 401);
}