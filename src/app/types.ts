export type Layer = {
	title: string;
	url: string;
	id: string;
};

export type LayersList = {
	total: number;
	layers: Layer[];
};
