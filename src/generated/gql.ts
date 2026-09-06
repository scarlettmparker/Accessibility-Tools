/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "query defineWord($word: String!, $scope: [WordScope!], $dictionary: WordDictionary) {\n  hadesQueries {\n    defineWord(word: $word, scope: $scope, dictionary: $dictionary) {\n      id\n      term\n      wordType\n      sourceUrl\n      entries {\n        id\n        term\n        wordType\n        sense\n        translations {\n          term\n          wordType\n          usageNotes\n        }\n        examples\n        note\n      }\n      compounds {\n        id\n        term\n        wordType\n        sense\n        translations {\n          term\n          wordType\n          usageNotes\n        }\n        examples\n        note\n      }\n      relatedWords {\n        id\n        term\n        sourceUrl\n      }\n    }\n  }\n}": typeof types.DefineWordDocument,
};
const documents: Documents = {
    "query defineWord($word: String!, $scope: [WordScope!], $dictionary: WordDictionary) {\n  hadesQueries {\n    defineWord(word: $word, scope: $scope, dictionary: $dictionary) {\n      id\n      term\n      wordType\n      sourceUrl\n      entries {\n        id\n        term\n        wordType\n        sense\n        translations {\n          term\n          wordType\n          usageNotes\n        }\n        examples\n        note\n      }\n      compounds {\n        id\n        term\n        wordType\n        sense\n        translations {\n          term\n          wordType\n          usageNotes\n        }\n        examples\n        note\n      }\n      relatedWords {\n        id\n        term\n        sourceUrl\n      }\n    }\n  }\n}": types.DefineWordDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query defineWord($word: String!, $scope: [WordScope!], $dictionary: WordDictionary) {\n  hadesQueries {\n    defineWord(word: $word, scope: $scope, dictionary: $dictionary) {\n      id\n      term\n      wordType\n      sourceUrl\n      entries {\n        id\n        term\n        wordType\n        sense\n        translations {\n          term\n          wordType\n          usageNotes\n        }\n        examples\n        note\n      }\n      compounds {\n        id\n        term\n        wordType\n        sense\n        translations {\n          term\n          wordType\n          usageNotes\n        }\n        examples\n        note\n      }\n      relatedWords {\n        id\n        term\n        sourceUrl\n      }\n    }\n  }\n}"): (typeof documents)["query defineWord($word: String!, $scope: [WordScope!], $dictionary: WordDictionary) {\n  hadesQueries {\n    defineWord(word: $word, scope: $scope, dictionary: $dictionary) {\n      id\n      term\n      wordType\n      sourceUrl\n      entries {\n        id\n        term\n        wordType\n        sense\n        translations {\n          term\n          wordType\n          usageNotes\n        }\n        examples\n        note\n      }\n      compounds {\n        id\n        term\n        wordType\n        sense\n        translations {\n          term\n          wordType\n          usageNotes\n        }\n        examples\n        note\n      }\n      relatedWords {\n        id\n        term\n        sourceUrl\n      }\n    }\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;