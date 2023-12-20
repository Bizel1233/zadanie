import { useApi } from "../context/api/hook";

export const useAuth = () => {
	const { post, setToken } = useApi();

	// logowanie użytkownika
	async function login(login: string, password: string) {
		const res = await post<{ token: string }>("/authenticate", { username: login, password: password });
		if (res !== undefined) {
			localStorage.setItem("token", res.data.token);
			setToken(res.data.token);
		}
	}

	// wylogowanie użytkownika
	function logout() {
		localStorage.removeItem("token");
		setToken(null);
	}

	return { login, logout };
};
