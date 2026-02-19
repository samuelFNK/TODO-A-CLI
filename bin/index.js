#!/usr/bin/env node

import {intro, outro, select, text, isCancel, cancel} from '@clack/prompts';
import chalk from 'chalk';
import { loadTodo, saveTodo } from '../lib/db.js';
import { inputWithPrefill } from '../lib/helpers.js';


async function main() {
    
    intro(chalk.cyan('TODO-A-CLI'));

    let loop = true;
    while(loop){
        
        const action = await select({
            message: chalk.cyan('What todo?'),
            options: [
                {value: 'view', label: chalk.cyan('View todo list.')},
                {value: 'done', label: chalk.cyan('Mark todo as done.')},
                {value: 'not done', label: chalk.cyan('Mark todo as not done.')},
                {value: 'add', label: chalk.cyan('Add something todo.')},
                {value: 'edit', label: chalk.cyan('Edit existing todo.')},
                {value: 'remove', label: chalk.cyan('Remove a todo.')},
                {value: 'leave', label: chalk.cyan('Leave.')}
            ]
        });

        const todo = loadTodo();


        if (action === 'view') {

            if (todo.length === 0) {
                console.log(chalk.red('Theres nothing TODO.'));
            } else {
                todo.forEach((item, i) => {
                    const status = item.done ? chalk.green.bold("[x]") : chalk.red.bold("[]");
                    const time = chalk.cyan.dim(new Date(item.time).toLocaleDateString());
                    console.log(chalk.cyan(`${i + 1}: ${item.text} ${status} ${time}`))
                });

                await select({
                    message: chalk.cyan.dim('. . .'),
                    options: [
                        {value: 'back.', label: chalk.cyan('Done.')}
                    ]
                });
            }
        }


        if (action === 'add') {
            const newItem = await text({
                message: chalk.cyan('What would you like todo?')
            });

            todo.push({
                text: newItem,
                done: false,
                time: new Date().toISOString()
            });
            saveTodo(todo);

            console.log(chalk.cyan('Added.'))
        }


        if (action === 'remove') {
            if (todo.length === 0) {
                console.log(chalk.red('No todos to remove.'));
            } else {
                const index = await select({
                    message: chalk.cyan('Which todo to remove?'),
                    options: [ 
                        ...todo.map((item, i) => ({
                            value: i,
                            label: chalk.cyan(`${item.text} ${item.done ? chalk.green("[x]") : chalk.red("[]")}`)
                        })),
                        {value: 'back', label: chalk.cyan('Back.')}
                    ]
                });

                if (index === 'back') {
                    continue;
                }
                todo.splice(index, 1);
                saveTodo(todo);

                console.log(chalk.cyan('Todo removed.'));
            }
        }


        if (action === 'edit') {
            if (todo.length === 0) {
                console.log(chalk.red('No todos to edit.'));
            } else {
                const index = await select({
                    message: chalk.cyan('Which todo to edit?'),
                    options: [
                        ...todo.map((item, i) => ({
                            value: i,
                            label: chalk.cyan(`${item.text} ${item.done ? chalk.green("[x]") : chalk.red("[]")}`)
                        })),
                        {value: 'back', label: chalk.cyan('Back.')}
                    ]
                });

                if (index === 'back') {
                    continue;
                }

                const edit = await inputWithPrefill(chalk.cyan('Edit todo: '), todo[index].text);
                todo[index].text = edit;
                saveTodo(todo);
                console.log(chalk.cyan('Todo edited.'));
            }
        }

        if (action === 'done') {
            if (todo.length === 0) {
                console.log(chalk.red('No todos to mark.'));
            } else {

                const index = await select({
                    message: chalk.cyan('Which todo to mark done?'),
                    options: todo.map((item, i) => ({
                        value: i,
                        label: item.text
                    }))
                });

                if (todo[index].done === true) {
                    console.log(chalk.red('This todo is already marked as done.'));
                } else {
                    todo[index].done = true;
                    saveTodo(todo);
                    console.log(chalk.green('Done!'));
                }
            }
        }


        if (action === 'not done') {
            if (todo.length === 0) {
                console.log(chalk.red('No todos to mark.'));
            } else {

                const index = await select({
                    message: chalk.cyan('Which todo to mark not done?'),
                    options: todo.map((item, i) => ({
                        value: i,
                        label: item.text
                    }))
                });

                if (todo[index].done === false) {
                    console.log(chalk.red('This todo is already marked as not done.'))    
                } else {
                    todo[index].done = false;
                    saveTodo(todo);
                    console.log(chalk.cyan('Undone!'));
                }
                
            }
        }


        if (action === 'leave') {
            console.log(chalk.cyan('Leaving.'))
            loop = false;
        }


        if (isCancel(action)) {
            cancel(chalk.cyan('Leaving.'));
            process.exit(0);
        }

    }

    outro(chalk.cyan('CLI-BYE'));
}

main();