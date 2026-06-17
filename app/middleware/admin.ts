export default defineNuxtRouteMiddleware(async () => {
  const { loggedIn } = useUserSession();
  if (!loggedIn.value) {
    return navigateTo("/login");
  }

  try {
    const user = await useRequestFetch()<{ role: string }>("/api/user/me");
    if (user?.role !== "admin") {
      return navigateTo("/");
    }
  } catch {
    return navigateTo("/login");
  }
});
