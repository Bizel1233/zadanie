import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ClientAppDataType } from "../../common/useCreate";
import { useClientApp } from "../../common/useClientApp";
import "./clientApp.css";
import { useAuth } from "../../common/useAuth";
import Spinner from "../../widget/spinner/spinner";

export default function ClientApp() {
	const { id } = useParams();
	const { clientApp } = useClientApp();
	const [data, setData] = useState<ClientAppDataType>();
	const navigate = useNavigate();
	const { logout } = useAuth();

	const [dataLoading, setDataLoading] = useState(true);

	// Pobieranie danych z API
	useEffect(() => {
		const getData = async () => {
			try {
				if (id === undefined) return;
				const res = await clientApp(parseInt(id));
				if (res !== undefined) setData(res.data);
				else navigate("/404"); //TODO: 404 page
			} catch (e) {
				console.log(e);
			}
			setDataLoading(false);
		};
		getData();
	}, [id]);

	const returnDate = (data: string) => {
		const date = new Date(data);
		return `${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}.${
			date.getMonth() + 1 < 10 ? "0" + date.getMonth() + 1 : date.getMonth() + 1
		}.${date.getFullYear()}`;
	};

	if (dataLoading)
		return (
			<div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
				<div style={{ width: "50px", height: "50px" }}>
					<Spinner />
				</div>
			</div>
		);
	return (
		<div>
			<button className="logout_button" onClick={logout}>
				Wyloguj się
			</button>
			<div className="app_client_container">
				<div className="app_title">
					<div>
						<div className="app_name">{data?.appName}</div>
						<div className="app_version">{data?.version}</div>
					</div>
					<div className="go_back_button">
						<Link to="/main">
							<button>Cofnij</button>
						</Link>
					</div>
				</div>

				<div className="advanced_info">
					<div className="info">
						<div className="side_element">
							<div className="font-12 opacity-08">Nazwa głównego pliku .exe aplikacji</div>
							<div>{data?.fileName}</div>
						</div>
						<div className="side_element">
							<div className="font-12 opacity-08">Argumenty uruchomienia aplikacji</div>
							<div>{data?.launchArgs}</div>
						</div>
						<div className="side_element">
							<div className="font-12 opacity-08">Hash MD5 paczki aplikacji</div>
							<div>{data?.md5}</div>
						</div>
						<div className="side_element">
							<div className="font-12 opacity-08">Utworzona</div>
							<div className="app_create">
								<div>{returnDate(data!.createdAt)}</div>
								<div>
									<div className="font-12 opacity-08" style={{ marginTop: "8px" }}>
										Przez
									</div>
									<div>{data?.createdBy.username}</div>
									<div className="font-14">{data?.createdBy.email}</div>
								</div>
							</div>
						</div>
					</div>
					<Link to={data!.url} className="url" target="_blank">
						<button>{data?.url}</button>
					</Link>

					{data?.updatedAt == null ? (
						<></>
					) : (
						<div className="side_element">
							<div className="font-12">Ostatnia modyfikacja</div>
							<div>
								<div>{data.updatedBy?.username}</div>
								<div>{data.updatedBy?.email}</div>
								<div className="font-14">{data.updatedAt}</div>
							</div>
						</div>
					)}
				</div>
				<div className="app_description">
					<div className="font-12 opacity-08" style={{ marginTop: "8px" }}>
						Opis
					</div>
					<div>{data?.description}</div>
				</div>
			</div>
		</div>
	);
}
