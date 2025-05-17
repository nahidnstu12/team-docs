import { BaseService } from "./BaseService";
import { RoleDTO } from "../DTOs/RoleDTO";

export class RoleService extends BaseService {
	static modelName = "role";
	static dto = RoleDTO;
}
