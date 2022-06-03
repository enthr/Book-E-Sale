export class PublisherModel {
	id?: number;
	name!: string;
    address!: string;
    contact!: string;

	constructor() {
		this.id = 0;
		this.name = '';
        this.address = '';
        this.contact = '';
	}
}