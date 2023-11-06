import { get, writable } from 'svelte/store';

const { set, subscribe, update } = writable<{
	loading: boolean;
	data: {
		data: {
			users: {
				id: string;
				google_name: string;
				google_profile: string;
			}[];
		};
	} | null;
}>({
	loading: false,
	data: null
});

const setLoading = (loading: boolean) => {
	update((value) => ({ ...value, loading }));
};

const fetchUsers = async () => {
	if (get(createUsersStore).data) return get(createUsersStore).data;

	setLoading(true);

	const response = await fetch('/api/users');
	const json = await response.json();

	setLoading(false);

	if (json.error) {
		console.log(json.error);
		return;
	}

	update((value) => ({
		...value,
		data: json
	}));

	return json;
};

const createUsersStore = {
	subscribe,
	fetchUsers
};

export default createUsersStore;
