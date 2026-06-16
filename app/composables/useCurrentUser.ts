import { useUserStore, type CurrentUser } from '~/stores/user'

export const useCurrentUser = () => {
  const store = useUserStore()
  const fetchFn = useRequestFetch()

  return useAsyncData<CurrentUser>('current-user', async () => {
    const data = await fetchFn<CurrentUser>('/api/user/me')
    store.user = data
    return data
  })
}
