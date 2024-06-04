import { writeFileSync, readFileSync } from 'fs';
import babelTraverse from '@babel/traverse';
import { parse, ParserPlugin } from '@babel/parser';
import generate from '@babel/generator';
import * as t from '@babel/types';

import moduleGenerator from '../src/index';



it('works', () => {

  const fileContentStr = `
      {
        "Pools": {
            "requestType": "QueryPoolsRequest",
            "responseType": "QueryPoolsResponse"
        }
       }
 `;

  const ast = moduleGenerator(fileContentStr);

  expect(generate(ast).code).toMatchSnapshot();

});

it('should work for multi-module setting', () => {
  const fileContentStr = readFileSync('./example-methods.json', 'utf-8').toString()
  const plugins: ParserPlugin[] = ['typescript',];

  const ast = moduleGenerator(fileContentStr);

  expect(generate(ast).code).toMatchSnapshot();
})
