import * as authSchema from "./schema/auth-schema";
import * as indexSchema from "./schema/index";
import * as relationsSchema from "./schema/relations";

const tables = { ...indexSchema, ...authSchema, ...relationsSchema };

export default tables;
