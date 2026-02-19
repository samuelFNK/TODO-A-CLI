import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';

const DIR = path.join(os.homedir(), '.todo-a-cli');
const DB_PATH = path.join(DIR, 'todo.json');

function ensureDB() {
    if (!fs.existsSync(DIR)) {
        fs.mkdirSync(DIR);
    }
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify([]));
    }
}

export function loadTodo() {
    ensureDB();
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

export function saveTodo(todo) {
    ensureDB();
    fs.writeFileSync(DB_PATH, JSON.stringify(todo, null, 2));
}