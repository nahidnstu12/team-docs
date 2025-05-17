import { PageDTO } from "../DTOs/PageDTO";
import { BaseService } from "./BaseService";

export class PageServices extends BaseService {
	static modelName = "page";
	static dto = PageDTO;
}
