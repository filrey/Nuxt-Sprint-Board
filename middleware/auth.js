export default function(context) {
  console.log("[Middleware] Auth");

  if (!context.store.getters.isAuthenticated) {
    context.store.dispatch("toggleSnackbar", {
      message: "You must be logged in to view this page",
      color: "error"
    });
    context.redirect("/login");
  }
}
