/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {KeyValuePipe} from '@angular/common';
import {KeyValueDiffers} from '@angular/core';
import {describe, expect, inject, it} from '@angular/core/testing/src/testing_internal';

import {defaultComparator} from '../../src/pipes/keyvalue_pipe';

describe('KeyValuePipe', () => {
  it('should return null when given null', inject([KeyValueDiffers], (differs: KeyValueDiffers) => {
       const pipe = new KeyValuePipe(differs);
       expect(pipe.transform(null)).toEqual(null);
     }));
  it('should return null when given undefined',
     inject([KeyValueDiffers], (differs: KeyValueDiffers) => {
       const pipe = new KeyValuePipe(differs);
       expect(pipe.transform(undefined as any)).toEqual(null);
     }));
  it('should return null for an unsupported type',
     inject([KeyValueDiffers], (differs: KeyValueDiffers) => {
       const pipe = new KeyValuePipe(differs);
       const fn = () => {};
       expect(pipe.transform(fn as any)).toEqual(null);
     }));
  describe('object dictionary', () => {
    it('should transform a basic dictionary',
       inject([KeyValueDiffers], (differs: KeyValueDiffers) => {
         const pipe = new KeyValuePipe(differs);
         expect(pipe.transform({1: 2})).toEqual([{key: '1', value: 2}]);
       }));
    it('should order by alpha', inject([KeyValueDiffers], (differs: KeyValueDiffers) => {
         const pipe = new KeyValuePipe(differs);
         expect(pipe.transform({'b': 1, 'a': 1})).toEqual([
           {key: 'a', value: 1}, {key: 'b', value: 1}
         ]);
       }));
    it('should order by numerical', inject([KeyValueDiffers], (differs: KeyValueDiffers) => {
         const pipe = new KeyValuePipe(differs);
         expect(pipe.transform({2: 1, 1: 1})).toEqual([{key: '1', value: 1}, {key: '2', value: 1}]);
       }));
    it('should order by numerical and alpha',
       inject([KeyValueDiffers], (differs: KeyValueDiffers) => {
         const pipe = new KeyValuePipe(differs);
         const input = {2: 1, 1: 1, 'b': 1, 0: 1, 3: 1, 'a': 1};
         expect(pipe.transform(input)).toEqual([
           {key: '0', value: 1}, {key: '1', value: 1}, {key: '2', value: 1}, {key: '3', value: 1},
           {key: 'a', value: 1}, {key: 'b', value: 1}
         ]);
       }));
    it('should return the same ref if nothing changes',
       inject([KeyValueDiffers], (differs: KeyValueDiffers) => {
         const pipe = new KeyValuePipe(differs);
         const transform1 = pipe.transform({1: 2});
         const transform2 = pipe.transform({1: 2});
         expect(transform1 === transform2).toEqual(true);
       }));
    it('should return a new ref if something changes',
       inject([KeyValueDiffers], (differs: KeyValueDiffers) => {
         const pipe = new KeyValuePipe(differs);
         const transform1 = pipe.transform({1: 2});
         const transform2 = pipe.transform({1: 3});
         expect(transform1 !== transform2).toEqual(true);
       }));
  });

  describe('Map', () => {
    it('should transform a basic Map', inject([KeyValueDiffers], (differs: KeyValueDiffers) => {
         const pipe = new KeyValuePipe(differs);
         expect(pipe.transform(new Map([[1, 2]]))).toEqual([{key: 1, value: 2}]);
       }));
    it('should order by alpha', inject([KeyValueDiffers], (differs: KeyValueDiffers) => {
         const pipe = new KeyValuePipe(differs);
         expect(pipe.transform(new Map([['b', 1], ['a', 1]]))).toEqual([
           {key: 'a', value: 1}, {key: 'b', value: 1}
         ]);
       }));
    it('should order by numerical', inject([KeyValueDiffers], (differs: KeyValueDiffers) => {
         const pipe = new KeyValuePipe(differs);
         expect(pipe.transform(new Map([[2, 1], [1, 1]]))).toEqual([
           {key: 1, value: 1}, {key: 2, value: 1}
         ]);
       }));
    it('should order by numerical and alpha',
       inject([KeyValueDiffers], (differs: KeyValueDiffers) => {
         const pipe = new KeyValuePipe(differs);
         const input = [[2, 1], [1, 1], ['b', 1], [0, 1], [3, 1], ['a', 1]];
         expect(pipe.transform(new Map(input as any))).toEqual([
           {key: 0, value: 1}, {key: 1, value: 1}, {key: 2, value: 1}, {key: 3, value: 1},
           {key: 'a', value: 1}, {key: 'b', value: 1}
         ]);
       }));
    it('should order by complex types with compareFn',
       inject([KeyValueDiffers], (differs: KeyValueDiffers) => {
         const pipe = new KeyValuePipe(differs);
         const input = new Map([[{id: 1}, 1], [{id: 0}, 1]]);
         expect(pipe.transform<{id: number}, number>(input, (a, b) => a.key.id > b.key.id ? 1 : -1))
             .toEqual([
               {key: {id: 0}, value: 1},
               {key: {id: 1}, value: 1},
             ]);
       }));
    it('should return the same ref if nothing changes',
       inject([KeyValueDiffers], (differs: KeyValueDiffers) => {
         const pipe = new KeyValuePipe(differs);
         const transform1 = pipe.transform(new Map([[1, 2]]));
         const transform2 = pipe.transform(new Map([[1, 2]]));
         expect(transform1 === transform2).toEqual(true);
       }));
    it('should return a new ref if something changes',
       inject([KeyValueDiffers], (differs: KeyValueDiffers) => {
         const pipe = new KeyValuePipe(differs);
         const transform1 = pipe.transform(new Map([[1, 2]]));
         const transform2 = pipe.transform(new Map([[1, 3]]));
         expect(transform1 !== transform2).toEqual(true);
       }));
  });
});

describe('defaultComparator', () => {
  it('should remain the same order when keys are equal', () => {
    const key = 1;
    const values = [{key, value: 2}, {key, value: 1}];
    expect(values.sort(defaultComparator)).toEqual(values);
  });
  it('should sort undefined keys to the end', () => {
    const values = [{key: 3, value: 1}, {key: undefined, value: 3}, {key: 1, value: 2}];
    expect(values.sort(defaultComparator)).toEqual([
      {key: 1, value: 2}, {key: 3, value: 1}, {key: undefined, value: 3}
    ]);
  });
  it('should sort null keys to the end', () => {
    const values = [{key: 3, value: 1}, {key: null, value: 3}, {key: 1, value: 2}];
    expect(values.sort(defaultComparator)).toEqual([
      {key: 1, value: 2}, {key: 3, value: 1}, {key: null, value: 3}
    ]);
  });
  it('should sort strings in alpha ascending', () => {
    const values = [{key: 'b', value: 1}, {key: 'a', value: 3}];
    expect(values.sort(defaultComparator)).toEqual([{key: 'a', value: 3}, {key: 'b', value: 1}]);
  });
  it('should sort numbers in numerical ascending', () => {
    const values = [{key: 2, value: 1}, {key: 1, value: 3}];
    expect(values.sort(defaultComparator)).toEqual([{key: 1, value: 3}, {key: 2, value: 1}]);
  });
  it('should sort boolean in false (0) -> true (1)', () => {
    const values = [{key: true, value: 3}, {key: false, value: 1}];
    expect(values.sort(defaultComparator)).toEqual([{key: false, value: 1}, {key: true, value: 3}]);
  });
  it('should sort numbers as strings in numerical ascending', () => {
    const values = [{key: '2', value: 1}, {key: 1, value: 3}];
    expect(values.sort(defaultComparator)).toEqual([{key: 1, value: 3}, {key: '2', value: 1}]);
  });
});
