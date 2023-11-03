import { writable } from 'svelte/store';

const { subscribe, set } = writable({
	title: '',
	description: ''
});

function setStore(title: string, description: string) {
	set({ title, description });

	const modalTrigger = document?.getElementById('trigger-modal');
	if (modalTrigger) {
		modalTrigger.click();
	}
}

export default {
	subscribe,
	set: setStore
};
