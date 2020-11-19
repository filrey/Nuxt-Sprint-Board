export default function(context) {

  if (!context.store.getters.isAuthenticated) {
    context.store.dispatch("toggleSnackbar", {
      message: "You must be logged in to view this page",
      color: "error"
    });
    context.redirect("/login");
  }
}
