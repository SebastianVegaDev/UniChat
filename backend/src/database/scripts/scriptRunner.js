import { pathToFileURL } from "node:url";
import { pool } from "../../config/db.js";

export function isDirectRun(importMetaUrl) {
    return process.argv[1]
        ? importMetaUrl === pathToFileURL(process.argv[1]).href
        : false;
}

export async function runDatabaseScript(script) {
    try {
        await script();
        console.log("Done.");
    } catch (error) {
        console.error(error);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}