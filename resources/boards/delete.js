// Example On Delete: Prevent non-admins from deleting
if (!me || me.role !== 'admin') {
  cancel("You must be an admin to delete this", 401);
}