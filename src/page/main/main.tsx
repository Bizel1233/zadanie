import { useCallback, useEffect, useRef, useState } from "react";
import { clientAppsDataType, useMain } from "../../common/useMain";
import "./main.css";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../../common/useAuth";
import Spinner from "../../widget/spinner/spinner";
import Loading from "../../widget/loading/loading";
import { usePage } from "../../common/usePage";

export default function Main() {
	const [searchParams, setSearchParams] = useSearchParams();
	const main = useMain();
	const { logout } = useAuth();

	const availableItemsPerPage = [2, 10, 30, 60, 90];
	let itemsPerPage = searchParams.get("itemsPerPage") ? Number(searchParams.get("itemsPerPage")) : availableItemsPerPage[0];
	if (!availableItemsPerPage.includes(itemsPerPage)) {
		itemsPerPage = availableItemsPerPage[0];
	}

	const filters = Array.from(new Set(searchParams.getAll("filter").map((e) => e.toLowerCase())));

	const [data, setData] = useState<clientAppsDataType | undefined>();
	const [dataLoading, setDataLoading] = useState<boolean>(true);
	const { currentPage, setPage, setParams } = usePage(data, itemsPerPage);

	const input = useRef<HTMLInputElement>(null);

	// Pobieranie danych z API
	useEffect(() => {
		const getData = async () => {
			setDataLoading(true);
			try {
				const res = await main.clientApps({
					page: currentPage ?? 1,
					itemsPerPage: itemsPerPage,
					appName: filters.length > 0 ? filters : undefined,
				});
				setData(res?.data);
			} catch (e) {
				console.log(e);
			}
			setDataLoading(false);
		};

		getData();
	}, [currentPage, itemsPerPage, searchParams.get("filter")]);

	const returnDate = (data: string) => {
		const date = new Date(data);
		return `${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}.${
			date.getMonth() + 1 < 10 ? "0" + date.getMonth() + 1 : date.getMonth() + 1
		}.${date.getFullYear()}`;
	};

	const setItemPerPage = (value: string) => {
		if (availableItemsPerPage.includes(Number(value))) {
			setParams("itemsPerPage", value);
		}
	};

	//dodawanie filtrów
	const setFiltersFunc = () => {
		if (input.current?.value === undefined || input.current?.value === "") return;
		let serachList = input.current.value.split(",");
		serachList = serachList.map((e) => {
			const newValue = e.trim().toLowerCase();
			if (!filters.includes(newValue)) return newValue;
			return "";
		});
		let newSerachList = filters;
		newSerachList = newSerachList.concat(serachList.filter((e) => !filters.includes(e) && e !== ""));
		newSerachList = Array.from(new Set(newSerachList)); //usuwanie duplikatów
		if (newSerachList === undefined) return;
		input.current.value = "";

		if (newSerachList.length === filters.length) return;

		//ustawianie nowych parametrów filtrowania
		const newParams = new URLSearchParams(searchParams.toString());
		newParams.delete("filter");
		newSerachList.forEach((e) => {
			newParams.append("filter", e);
		});
		setSearchParams(newParams);
	};

	const setFiltersEnterHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") setFiltersFunc();
	};

	//usuwanie konkretnego filtra
	const filterRemoveHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		const removed = e.currentTarget.getAttribute("data-value");
		const newParams = new URLSearchParams(searchParams.toString());
		newParams.delete("filter");
		filters.forEach((e) => {
			if (e !== removed) newParams.append("filter", e);
		});
		setSearchParams(newParams);
	};

	const changePageEnterHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			setPage(event.currentTarget.valueAsNumber);
			event.currentTarget.value = "";
		}
	};

	//wyświetlanie danych
	const GetData = useCallback(() => {
		if (dataLoading)
			return (
				<div style={{ display: "flex", justifyContent: "center", paddingBottom: "30px", marginTop: "-10px" }}>
					<Loading />
				</div>
			);

		return (
			<div className="client_apps_rows">
				{data?.["hydra:member"].map((e, index) => {
					return (
						<div className="client_apps_row record" key={index}>
							<Link to={`/clientApp/${e.id}`}>
								<div>{e.appName}</div>
							</Link>
							<Link to={`/clientApp/${e.id}`}>
								<div>{e.version}</div>
							</Link>
							<div className="record_url">
								<Link className="button" to={e.url} target="_blank">
									{e.url}
								</Link>

								<Link to={`/clientApp/${e.id}`}></Link>
							</div>
							<Link to={`/clientApp/${e.id}`}>
								<div>{e.updatedAt ? returnDate(e.updatedAt) : returnDate(e.createdAt)}</div>
							</Link>
						</div>
					);
				})}
			</div>
		);
	}, [data, dataLoading]);

	//menu wyboru strony
	const GetPageMenu = useCallback(() => {
		if (dataLoading)
			return (
				<div className="h25 w25">
					<Spinner />
				</div>
			);

		const first = 1;
		let previous = Number(data?.["hydra:view"]?.["hydra:previous"]?.split("=")?.[2] ?? 0);
		let next = Number(data?.["hydra:view"]?.["hydra:next"]?.split("=")?.[2] ?? 0);
		let last = Number(data?.["hydra:view"]?.["hydra:last"]?.split("=")?.[2] ?? 1);

		return (
			<div className="select_page">
				{first !== currentPage ? (
					<div>
						<button
							className="button_page"
							onClick={() => {
								setPage(first);
							}}
						>
							{first}
						</button>
					</div>
				) : (
					<></>
				)}
				{previous !== 0 && previous > first + 1 ? (
					<div>
						<input
							type="number"
							className="button_page remove_arrow"
							placeholder="..."
							onKeyDown={changePageEnterHandler}
							onBlur={(e) => {
								setPage(e.currentTarget.valueAsNumber);
								e.currentTarget.value = "";
							}}
						/>
					</div>
				) : (
					<></>
				)}
				{previous !== 0 && previous !== first ? (
					<div>
						<button
							className="button_page"
							onClick={() => {
								setPage(previous);
							}}
						>
							{previous}
						</button>
					</div>
				) : (
					<></>
				)}

				<div>
					<button className="button_page current_page">{currentPage}</button>
				</div>
				{next !== 0 && next !== last ? (
					<div>
						<button
							className="button_page"
							onClick={() => {
								setPage(next);
							}}
						>
							{next}
						</button>
					</div>
				) : (
					<></>
				)}
				{next !== 0 && next < last - 1 ? (
					<div>
						<input
							type="number"
							className="button_page remove_arrow"
							placeholder="..."
							onKeyDown={changePageEnterHandler}
							onBlur={(e) => {
								setPage(e.currentTarget.valueAsNumber);
								e.currentTarget.value = "";
							}}
						/>
					</div>
				) : (
					<></>
				)}
				{last !== 1 && last !== currentPage ? (
					<div>
						<button
							className="button_page"
							onClick={() => {
								setPage(last);
							}}
						>
							{last}
						</button>
					</div>
				) : (
					<></>
				)}
			</div>
		);
	}, [currentPage, data, dataLoading, changePageEnterHandler, setPage]);

	//menu wyboru strony na dole strony (jeśli jest dużo danych)
	const GetDownPageMenu = useCallback(() => {
		const windowHeight = window.innerHeight;
		const pageHeight = document.documentElement.scrollHeight;
		const difference = pageHeight - windowHeight;

		if (difference >= 300) {
			return (
				<div className="end_page_menu">
					<GetPageMenu />
				</div>
			);
		} else {
			return <></>;
		}
	}, [GetPageMenu]);

	return (
		<div>
			<div className="client_apps_container">
				<button className="logout_button" onClick={logout}>
					Wyloguj się
				</button>
				<div className="active_filters">
					{filters.length > 0 ? (
						filters.map((e, index) => {
							return (
								<div key={index} className="filter_position" data-value={e} onClick={filterRemoveHandler}>
									{e}
									<div className="button">X</div>
								</div>
							);
						})
					) : (
						<></>
					)}
				</div>
				<div className="flex-between margin-bot-15">
					<input
						placeholder="Wyszukaj"
						className="client_app_input"
						type="text"
						ref={input}
						onBlur={setFiltersFunc}
						onKeyDown={setFiltersEnterHandler}
					/>

					<div>
						<Link to={"/create"}>
							<button className="add_client_app_button">Dodaj nową pozycje</button>
						</Link>
					</div>
				</div>
				<div className="flex-between page_menu">
					<select
						className="item_per_page_select"
						defaultValue={itemsPerPage}
						onChange={(e) => {
							setItemPerPage(e.currentTarget.value);
						}}
					>
						{availableItemsPerPage.map((e) => {
							return (
								<option key={e} value={e}>
									{e}
								</option>
							);
						})}
					</select>
					<GetPageMenu />
				</div>
				<div className="table">
					<div className="client_apps_row_headers client_apps_row">
						<div>Nazwa</div>
						<div>Wersja</div>
						<div>Url</div>
						<div>Data modyfikacji</div>
					</div>
					<GetData />
				</div>
				<GetDownPageMenu />
			</div>
		</div>
	);
}
