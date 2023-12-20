import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./page/login/login";
import "./App.css";
import Main from "./page/main/main";
import { useApi } from "./context/api/hook";
import Create from "./page/create/create";
import ClientApp from "./page/clientApp/clientApp";

export function App() {
	const { token } = useApi();

	if (token === null) return <Login />;

	return (
		<div className="App">
			<Routes>
				<Route path="/create" element={<Create />} />
				<Route path="/clientApp/:id" element={<ClientApp />} />
				<Route path="/main" element={<Main />} />
				<Route path="*" element={<Navigate to="/main" replace />} />
			</Routes>
		</div>
	);
}
