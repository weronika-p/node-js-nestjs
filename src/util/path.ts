import { dirname } from "path/posix"

const rootDir = dirname(require.main.filename);

export default rootDir;