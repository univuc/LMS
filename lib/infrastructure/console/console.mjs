/**
 * This file is part of Univuc/LMS.
 *
 * Copyright (C) 2020 Univuc <potados99@gmail.com>
 *
 * Univuc/LMS is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Univuc/LMS is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import getArg, {getAllArgs} from '../../common/utils/args';
import LocalRunner from './LocalRunner';
import User from '../../domain/entities/User';
import TextBox from '../../common/utils/TextBox';

export default async function runLocal() {
    const {userId, password, command, args} = getArguments();

    brief(userId, password, command, args);

    const user = new User({
        id: userId,
        password: password,
    });

    const runner = new LocalRunner({user, command});

    await runner.run(args);
}

function getArguments() {
    const userId = getArg('user');
    const password = getArg('password');
    const command = getArg('_')[0];

    if (!userId || !password || !command) {
        usage();
    }

    const args = getCommandArgs();

    return {userId, password, command, args};
}

function getCommandArgs() {
    const allArguments = getAllArgs();
    const nonCommandArgKeys = ['_', 'execute', 'user', 'password'];

    return copyObjectExcluding(allArguments, nonCommandArgKeys);
}

function copyObjectExcluding(original, excludeKeys) {
    const newObject = {};

    for (const key of Object.keys(original)) {
        const isToCopy = !excludeKeys.includes(key);
        if (isToCopy) {
            newObject[key] = original[key];
        }
    }

    return newObject;
}

function usage() {
    console.log('Usage: node -r esm index.mjs --execute --user=[id] --password=[password] command [args]...');
    process.exit(1);
}

function brief(userId, password, command, args) {
    const textBox = new TextBox({width: 80});

    textBox.setTitle('Running LMS in direct execution mode');
    textBox.setContent([
        `User: ${userId}/${password}`,
        `Command: ${command}`,
        `Command Arguments: ${JSON.stringify(args)}`,
    ]);

    textBox.print();
}
