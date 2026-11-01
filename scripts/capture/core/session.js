export const useSession = () => ({
  data: {
    user: { id: "screenshot-demo", name: "Demo operator", role: "OWNER" },
  },
  status: "authenticated",
});
export const SessionProvider = ({ children }) => children;
export const signOut = async () => {};
