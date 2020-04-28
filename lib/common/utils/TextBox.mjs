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

// eslint-disable-next-line no-unused-vars
import * as Strinsg from '../extensions/String';

class TextBox {
    constructor({width=80}) {
        this.width = width;
        this.boxChar = '#';

        this.title = null;
        this.content = null;
    }

    setTitle(title) {
        if (!title || typeof title !== 'string') {
            return;
        }

        this.title = title;
    }

    setContent(content) {
        if (!content) {
            return;
        }

        if (Array.isArray(content)) {
            this.content = content;
        } else if (typeof content !== 'string') {
            this.content = content.toString().split('\n');
        }
    }

    print() {
        this._setWidthToFitContents();

        this._printStartLine();
        this._printMidLines();
        this._printEndLine();
    }

    _setWidthToFitContents() {
        const arrayOfLengths = [...this.content, this.title].map((str) => str.actualLength());
        const maxLength = Math.max(...arrayOfLengths) + 4;

        const needToExtend = this.width < maxLength;
        if (needToExtend) {
            this.width = maxLength;
        }
    }

    _printStartLine() {
        const startLineLength = this.width - this.title.actualLength() - 2;
        const startLineLeftLength = Math.floor(startLineLength / 2);
        const startLineRightLength = Math.ceil(startLineLength / 2);

        console.log(`${this.boxChar.repeat(startLineLeftLength)} ${this.title} ${this.boxChar.repeat(startLineRightLength)}`);
    }

    _printMidLines() {
        for (const line of this.content) {
            const afterPadding = this.width - line.actualLength() - 3;

            console.log(`${this.boxChar}${' '.repeat(1)}${line}${' '.repeat(afterPadding)}${this.boxChar}`);
        }
    }

    _printEndLine() {
        console.log(`${this.boxChar.repeat(this.width)}`);
    }
}

export default TextBox;
