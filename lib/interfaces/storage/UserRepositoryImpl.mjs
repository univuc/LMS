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

import UserRepository from '../../domain/repositories/UserRepository';
import User from '../../domain/entities/User';
import {getEnv} from 'env-arg';

class UserRepositoryImpl extends UserRepository {
    constructor() {
        super();

        const user = new User({
            id: getEnv('TEST_ID'),
            slackId: 'U012B7M56HW',
            password: getEnv('TEST_PW'),
        });

        this._users = [user];
    }

    addUser(user) {
        //
    }

    removeUser(id) {
        //
    }

    getUsers() {
        return this._users;
    }

    getUserById(id) {
        if (!id) {
            return null;
        }

        return this._users.find((user) => user.id === id);
    }

    getUserBySlackId(slackId) {
        return this._users.find((user) => user.slackId === slackId);
    }
}

export default UserRepositoryImpl;
