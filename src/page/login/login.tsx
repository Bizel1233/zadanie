import "./login.css";
import { useRef, useState } from "react";
import { useAuth } from "../../common/useAuth";
import Spinner from "../../widget/spinner/spinner";

export default function Login() {
	const auth = useAuth();
	const login = useRef<HTMLInputElement>(null);
	const password = useRef<HTMLInputElement>(null);
	const [isLoading, setIsLoading] = useState(false);

	const [error, setError] = useState(false);

	const loginButton = async () => {
		if (login.current?.value === undefined || password.current?.value === undefined) return;
		setIsLoading(true);

		try {
			const res = await auth.login(login.current.value, password.current.value);
			if (res === undefined) {
				setError(true);
			}
		} catch (error) {
			console.log(error);
		}
		setIsLoading(false);
	};

	if (isLoading)
		return (
			<div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
				<div style={{ width: "50px", height: "50px" }}>
					<Spinner />
				</div>
			</div>
		);
	return (
		<div className="main">
			<h2>Zaloguj się</h2>
			<div className="login_container">
				<div>
					<div className="input_container">
						<input
							className={error ? "huge_input input_error" : "huge_input"}
							type="text"
							placeholder="Login"
							ref={login}
							onChange={() => setError(false)}
						/>
						<input
							className={error ? "huge_input input_error" : "huge_input"}
							type="password"
							placeholder="Hasło"
							ref={password}
							onChange={() => setError(false)}
						/>
					</div>
					<div className="error_message" style={{ marginTop: "10px", fontSize: "14px" }}>
						{error && "Nieprawidłowy login lub hasło"}
					</div>
				</div>
				<div className="button_container">
					<button className="login_button" onClick={loginButton}>
						Zaloguj się
					</button>
				</div>
			</div>
		</div>
	);
}
