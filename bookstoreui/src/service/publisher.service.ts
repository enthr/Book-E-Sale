import request from './request';
import FilterModel from '../models/FilterModel';
import BaseList from '../models/BaseList';
import { PublisherModel } from '../models/PublisherModel';

class CategoryService {
	ENDPOINT = 'api/Publisher';

	public async getAll(
		params: FilterModel
	): Promise<BaseList<PublisherModel[]>> {
		const url = `${this.ENDPOINT}/list`;
		return request
			.get<BaseList<PublisherModel[]>>(url, { params })
			.then((res) => {
				return res.data;
			});
	}

	public async getById(id: number): Promise<PublisherModel> {
		const url = `${this.ENDPOINT}/${id}`;
		return request.get<PublisherModel>(url).then((res) => {
			return res.data;
		});
	}

	public async delete(id: number): Promise<PublisherModel> {
		const url = `${this.ENDPOINT}/Delete/${id}`;
		return request.delete<PublisherModel>(url).then((res) => {
			return res.data;
		});
	}

	public async save(data: PublisherModel): Promise<PublisherModel> {
		if (data.id) {
			const url = `${this.ENDPOINT}/Update`;
			return request.put<PublisherModel>(url, data).then((res) => {
				return res.data;
			});
		} else {
			const url = `${this.ENDPOINT}/Add`;
			return request.post<PublisherModel>(url, data).then((res) => {
				return res.data;
			});
		}
	}
}
export default new CategoryService();