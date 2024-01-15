export const modal = (modalId: string) => {
	const modal = document.getElementById(modalId) as HTMLDialogElement;
	return modal;
};
