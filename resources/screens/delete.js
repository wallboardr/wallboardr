if (!me || me.role !== 'admin') {
    cancel('Only an admin can delete a screen', 401);
}