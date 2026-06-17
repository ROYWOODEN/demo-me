export default defineNuxtRouteMiddleware(async () => {
  const { loggedIn } = useUserSession();
  if (!loggedIn.value) {
    return navigateTo("/login");
  }

  // Роль берём из БД (как и кнопка в шапке, и серверный requireAdmin),
  // а не из куки сессии — она хранит роль на момент входа и может быть устаревшей.
  try {
    const user = await useRequestFetch()<{ role: string }>("/api/user/me");
    if (user?.role !== "admin") {
      return navigateTo("/");
    }
  } catch {
    return navigateTo("/login");
  }
});
