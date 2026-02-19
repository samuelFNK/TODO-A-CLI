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
            {value: 'add', label: 'Add something todo.'},
            {value: 'edit', label: 'Edit existing todo.'},
            {value: 'remove', label: 'Remove a todo.'},
            {value: 'exit', label: 'Leave.'}
        ]
    });

    const todo = loadTodo();

    if (action === 'view') {
        console.log('TODO:');
        todo.forEach((item, i) => console.log(`${i + 1}. ${item}`));
    }


    if (action === 'add') {
        const newItem = await text({
            message: 'What would you like todo?'
        });

        todo.push(newItem);
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
                    label: item
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
                    label: item
                }))
            });

            const edit = await inputWithPrefill('Edit todo: ', todo[index]);
            todo[index] = edit;
            saveTodo(todo);
            console.log('Todo edited.');
        }
    }


    outro('A-CLI-WAS-DONE');
}

main();