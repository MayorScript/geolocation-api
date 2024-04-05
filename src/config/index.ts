require("dotenv").config();
const env = process.env.NODE_ENV || "development";
// @ts-ignore
const config = require(`./${env}`);

config.env = env;
export default Object.freeze({ ...config });
