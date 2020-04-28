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

// eslint-disable-next-line no-extend-native
String.prototype.withSearchParam = function(key, value) {
    const hasSearchParams = this.includes('?');

    if (hasSearchParams) {
        return appendSearchParam(this, key, value);
    } else {
        return addNewSearchParam(this, key, value);
    }
};

function appendSearchParam(origin, key, value) {
    return `${origin}&${key}=${value}`;
}

function addNewSearchParam(origin, key, value) {
    return `${origin}?${key}=${value}`;
}

// eslint-disable-next-line no-extend-native
String.prototype.toInt = function() {
    return Number(this);
};

// eslint-disable-next-line no-extend-native
String.prototype.actualLength = function() {
    let len = 0;

    for (let i = 0; i < this.length; i++) {
        if (escape(this.charAt(i)).length === 6) {
            len++;
        }
        len++;
    }

    return len;
};

export default String;
