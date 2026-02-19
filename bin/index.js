#!/usr/bin/env node

import {intro, outro, select, text} from '@clack/prompts';
import { loadTodo, saveTodo } from '../lib/db.js';
import { inputWithPrefill } from '../lib/helpers.js';


async function main() {
    intro('TODO-A-CLI');

    const action = await select({
        message: 'What todo?',
        options: [
            {value: 'view', label: 'View todo list.'},
            {value: 'mark done', label: 'Mark todo as done.'},
            {value: 'mark unfinished', label: 'Mark todo as unfinished.'},
            {value: 'add', label: 'Add something todo.'},
            {value: 'edit', label: 'Edit existing todo.'},
            {value: 'remove', label: 'Remove a todo.'},
            {value: 'exit', label: 'Leave.'}
        ]
    });

    const todo = loadTodo();

    if (action === 'view') {
        console.log('TODO:');

        todo.forEach((item, i) => {
            const status = item.done ? "[x]" : "[]";
            console.log(`${i + 1}: ${item.text} ${status}`)
        });
    }


    if (action === 'add') {
        const newItem = await text({
            message: 'What would you like todo?'
        });

        todo.push({
            text: newItem,
            done: false
        });
        saveTodo(todo);

        console.log('Added.')
    }


    if (action === 'remove') {
        if (todo.length === 0) {
            console.log('No todos to remove.');
        } else {
            const index = await select({
                message: 'Which todo to remove?',
                options: todo.map((item, i) => ({
                    value: i,
                    label: item.text
                }))
            });

            todo.splice(index, 1);
            saveTodo(todo);

            console.log('Todo removed.');
        }
    }


    if (action === 'edit') {
        if (todo.length === 0) {
            console.log('No todos to edit.');
        } else {
            const index = await select({
                message: 'Which todo to edit?',
                options: todo.map((item, i) => ({
                    value: i,
                    label: item.text
                }))
            });

            const edit = await inputWithPrefill('Edit todo: ', todo[index].text);
            todo[index].text = edit;
            saveTodo(todo);
            console.log('Todo edited.');
        }
    }

    if (action == 'done') {
        if (todo.length === 0) {
            console.log('No todos to mark.');
        } else {

            const index = await select({
                message: 'Which todo to mark done?',
                options: todo.map((item, i) => ({
                    value: i,
                    label: item.text
                }))
            });

            todo[index].done = true;
            saveTodo(todo);

            console.log('Done!');
        }
    }


    if (action == 'not done') {
        if (todo.length === 0) {
            console.log('No todos to mark.');
        } else {

            const index = await select({
                message: 'Which todo to mark unfinished?',
                options: todo.map((item, i) => ({
                    value: i,
                    label: item.text
                }))
            });

            if (todo[index].done === false) {
                console.log('This todo is already marked as unfinished.')    
            } else {
                todo[index].done = false;
                saveTodo(todo);
                console.log('Undone!');
            }
            
        }
    }


    outro('A-CLI-WAS-DONE');
}

main();