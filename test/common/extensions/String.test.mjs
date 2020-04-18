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
import String from '../../../lib/common/extensions/String';

describe('# Search param', () => {
   it('should add new search param', async () => {
        const result = 'path'.withSearchParam('hello', 'world');

        expect(result).toBe('path?hello=world');
   });

   it('should append search param', async () => {
       const result = 'path?yeah=yo'.withSearchParam('hello', 'world');

       expect(result).toBe('path?yeah=yo&hello=world');
   });

   it('should add search param of non-string', async () => {
       const result = 'path'.withSearchParam('hello', 123);

       expect(result).toBe('path?hello=123');
   });
});
