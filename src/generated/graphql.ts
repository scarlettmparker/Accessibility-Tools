/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type AnnotationInput = {
  body: Scalars['String']['input'];
  endOffset: Scalars['Int']['input'];
  startOffset: Scalars['Int']['input'];
  textId: Scalars['ID']['input'];
};

export enum CefrLevel {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2'
}

export type CommentInput = {
  annotationId: Scalars['ID']['input'];
  body: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['ID']['input']>;
};

/** A contributing complexity factor with a direction (up/down). */
export type ComplexityFactor = {
  __typename?: 'ComplexityFactor';
  direction: Scalars['String']['output'];
  name: Scalars['String']['output'];
  value: Scalars['Float']['output'];
  weight: Scalars['Float']['output'];
};

export type DiscordLoginResult = {
  __typename?: 'DiscordLoginResult';
  accountId: Scalars['ID']['output'];
  readerAccountId: Scalars['ID']['output'];
  requiresReactivation: Scalars['Boolean']['output'];
  token: Scalars['String']['output'];
};

/** A single filter applied to a paginated query. */
export type FilterInput = {
  field: Scalars['String']['input'];
  operator: FilterOperator;
  value: Scalars['String']['input'];
};

/** Operators for FilterInput. */
export enum FilterOperator {
  EndsWith = 'ENDS_WITH',
  Equals = 'EQUALS',
  GreaterThan = 'GREATER_THAN',
  GreaterThanOrEqual = 'GREATER_THAN_OR_EQUAL',
  In = 'IN',
  LessThan = 'LESS_THAN',
  LessThanOrEqual = 'LESS_THAN_OR_EQUAL',
  Matches = 'MATCHES',
  NotEquals = 'NOT_EQUALS',
  StartsWith = 'STARTS_WITH'
}

/** Write operations for the reader. */
export type HadesMutations = {
  __typename?: 'HadesMutations';
  addComment?: Maybe<QueryResult>;
  archiveText?: Maybe<QueryResult>;
  attachObject?: Maybe<QueryResult>;
  createAnnotation?: Maybe<QueryResult>;
  createPrivateNote?: Maybe<QueryResult>;
  createSource?: Maybe<QueryResult>;
  createText?: Maybe<QueryResult>;
  deleteAnnotation?: Maybe<QueryResult>;
  deleteComment?: Maybe<QueryResult>;
  deletePrivateNote?: Maybe<QueryResult>;
  discordLogin?: Maybe<DiscordLoginResult>;
  editAnnotation?: Maybe<QueryResult>;
  editComment?: Maybe<QueryResult>;
  markViewed?: Maybe<QueryResult>;
  removeVote?: Maybe<QueryResult>;
  shareNotes?: Maybe<QueryResult>;
  vote?: Maybe<QueryResult>;
};


/** Write operations for the reader. */
export type HadesMutationsAddCommentArgs = {
  input: CommentInput;
};


/** Write operations for the reader. */
export type HadesMutationsArchiveTextArgs = {
  id: Scalars['ID']['input'];
};


/** Write operations for the reader. */
export type HadesMutationsAttachObjectArgs = {
  source: Scalars['ID']['input'];
  target: Scalars['String']['input'];
};


/** Write operations for the reader. */
export type HadesMutationsCreateAnnotationArgs = {
  input: AnnotationInput;
};


/** Write operations for the reader. */
export type HadesMutationsCreatePrivateNoteArgs = {
  input: PrivateNoteInput;
};


/** Write operations for the reader. */
export type HadesMutationsCreateSourceArgs = {
  name: Scalars['String']['input'];
  url: Scalars['String']['input'];
};


/** Write operations for the reader. */
export type HadesMutationsCreateTextArgs = {
  input: ReaderTextInput;
};


/** Write operations for the reader. */
export type HadesMutationsDeleteAnnotationArgs = {
  id: Scalars['ID']['input'];
};


/** Write operations for the reader. */
export type HadesMutationsDeleteCommentArgs = {
  id: Scalars['ID']['input'];
};


/** Write operations for the reader. */
export type HadesMutationsDeletePrivateNoteArgs = {
  id: Scalars['ID']['input'];
};


/** Write operations for the reader. */
export type HadesMutationsDiscordLoginArgs = {
  code: Scalars['String']['input'];
  state: Scalars['String']['input'];
};


/** Write operations for the reader. */
export type HadesMutationsEditAnnotationArgs = {
  body: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};


/** Write operations for the reader. */
export type HadesMutationsEditCommentArgs = {
  body: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};


/** Write operations for the reader. */
export type HadesMutationsMarkViewedArgs = {
  textId: Scalars['ID']['input'];
};


/** Write operations for the reader. */
export type HadesMutationsRemoveVoteArgs = {
  targetId: Scalars['ID']['input'];
  targetType: ReaderVoteTarget;
};


/** Write operations for the reader. */
export type HadesMutationsShareNotesArgs = {
  input: ShareNotesInput;
};


/** Write operations for the reader. */
export type HadesMutationsVoteArgs = {
  input: VoteInput;
};

/** Read operations for the reader. */
export type HadesQueries = {
  __typename?: 'HadesQueries';
  annotation?: Maybe<ReaderAnnotation>;
  annotations: PagedReaderAnnotations;
  classifyTextLevel?: Maybe<TextLevelAssessment>;
  comments: PagedReaderComments;
  defineWord?: Maybe<Word>;
  locateReaderTexts: Array<ReaderText>;
  locateRemoteObjects: Array<ReaderObjectReference>;
  myVote?: Maybe<VoteValue>;
  privateNotes: PagedPrivateNotes;
  readerAccount?: Maybe<ReaderAccount>;
  readerAccounts: Array<ReaderAccount>;
  searchReaderAccounts: Array<ReaderAccount>;
  source?: Maybe<ReaderSource>;
  sources?: Maybe<Array<ReaderSource>>;
  text?: Maybe<ReaderText>;
  texts: PagedReaderTexts;
  viewedReaderTexts: PagedReaderTexts;
  viewedTexts: PagedTextViews;
};


/** Read operations for the reader. */
export type HadesQueriesAnnotationArgs = {
  id: Scalars['ID']['input'];
};


/** Read operations for the reader. */
export type HadesQueriesAnnotationsArgs = {
  includeHidden?: InputMaybe<Scalars['Boolean']['input']>;
  pagination?: InputMaybe<PaginationInput>;
  textId: Scalars['ID']['input'];
};


/** Read operations for the reader. */
export type HadesQueriesClassifyTextLevelArgs = {
  text: Scalars['String']['input'];
};


/** Read operations for the reader. */
export type HadesQueriesCommentsArgs = {
  annotationId: Scalars['ID']['input'];
  includeHidden?: InputMaybe<Scalars['Boolean']['input']>;
  pagination?: InputMaybe<PaginationInput>;
};


/** Read operations for the reader. */
export type HadesQueriesDefineWordArgs = {
  dictionary?: InputMaybe<WordDictionary>;
  scope?: InputMaybe<Array<WordScope>>;
  word: Scalars['String']['input'];
};


/** Read operations for the reader. */
export type HadesQueriesLocateReaderTextsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


/** Read operations for the reader. */
export type HadesQueriesLocateRemoteObjectsArgs = {
  ids: Array<Scalars['String']['input']>;
};


/** Read operations for the reader. */
export type HadesQueriesMyVoteArgs = {
  targetId: Scalars['ID']['input'];
  targetType: ReaderVoteTarget;
};


/** Read operations for the reader. */
export type HadesQueriesPrivateNotesArgs = {
  pagination?: InputMaybe<PaginationInput>;
  textId: Scalars['ID']['input'];
};


/** Read operations for the reader. */
export type HadesQueriesReaderAccountsArgs = {
  remoteUsers: Array<RemoteUserInput>;
};


/** Read operations for the reader. */
export type HadesQueriesSearchReaderAccountsArgs = {
  pagination?: InputMaybe<PaginationInput>;
  query: Scalars['String']['input'];
};


/** Read operations for the reader. */
export type HadesQueriesSourceArgs = {
  id: Scalars['ID']['input'];
};


/** Read operations for the reader. */
export type HadesQueriesTextArgs = {
  id: Scalars['ID']['input'];
};


/** Read operations for the reader. */
export type HadesQueriesTextsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


/** Read operations for the reader. */
export type HadesQueriesViewedReaderTextsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


/** Read operations for the reader. */
export type HadesQueriesViewedTextsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};

/** Predicted probability for a single CEFR level. */
export type LevelProbability = {
  __typename?: 'LevelProbability';
  level: CefrLevel;
  probability: Scalars['Float']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  hadesMutations: HadesMutations;
};

/** Generic page metadata for a paged list. */
export type PageInfo = {
  __typename?: 'PageInfo';
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  page: Scalars['Int']['output'];
  size: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PagedPrivateNotes = {
  __typename?: 'PagedPrivateNotes';
  items: Array<PrivateNote>;
  pageInfo: PageInfo;
};

export type PagedReaderAnnotations = {
  __typename?: 'PagedReaderAnnotations';
  items: Array<ReaderAnnotation>;
  pageInfo: PageInfo;
};

export type PagedReaderComments = {
  __typename?: 'PagedReaderComments';
  items: Array<ReaderComment>;
  pageInfo: PageInfo;
};

export type PagedReaderTexts = {
  __typename?: 'PagedReaderTexts';
  items: Array<ReaderText>;
  pageInfo: PageInfo;
};

export type PagedTextViews = {
  __typename?: 'PagedTextViews';
  items: Array<TextView>;
  pageInfo: PageInfo;
};

/** Generic pagination, sort, and filter input. */
export type PaginationInput = {
  filters?: InputMaybe<Array<FilterInput>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortDir?: InputMaybe<SortDirection>;
};

/** A per-user private note anchored to a text range. */
export type PrivateNote = {
  __typename?: 'PrivateNote';
  author?: Maybe<RemoteUser>;
  body: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  endOffset: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  remoteObject?: Maybe<Array<Scalars['String']['output']>>;
  startOffset: Scalars['Int']['output'];
  textId: Scalars['ID']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  visibility: PrivateNoteVisibility;
};

export type PrivateNoteInput = {
  body: Scalars['String']['input'];
  endOffset: Scalars['Int']['input'];
  startOffset: Scalars['Int']['input'];
  textId: Scalars['ID']['input'];
};

export enum PrivateNoteVisibility {
  Private = 'PRIVATE',
  Shared = 'SHARED'
}

export type Query = {
  __typename?: 'Query';
  hadesQueries: HadesQueries;
};

export type QueryResult = QuerySuccess | StandardError;

export type QuerySuccess = {
  __typename?: 'QuerySuccess';
  id?: Maybe<Scalars['ID']['output']>;
  message: Scalars['String']['output'];
};

/** Reader-specific profile for a member. */
export type ReaderAccount = {
  __typename?: 'ReaderAccount';
  avatar?: Maybe<Scalars['String']['output']>;
  cefrLevel?: Maybe<CefrLevel>;
  discordId: Scalars['String']['output'];
  discordUsername?: Maybe<Scalars['String']['output']>;
  gaiaAccountId: Scalars['ID']['output'];
  globalName?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  roles: Array<ReaderRole>;
};

/** A markdown explanation a user wrote for a position. */
export type ReaderAnnotation = {
  __typename?: 'ReaderAnnotation';
  author?: Maybe<RemoteUser>;
  body: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  downvotes: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  myVote?: Maybe<VoteValue>;
  netScore: Scalars['Int']['output'];
  position?: Maybe<ReaderPosition>;
  positionId: Scalars['ID']['output'];
  remoteObject?: Maybe<Array<Scalars['String']['output']>>;
  replyCount: Scalars['Int']['output'];
  status: ReaderStatus;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  upvotes: Scalars['Int']['output'];
};

/** A threaded reply on an annotation. */
export type ReaderComment = {
  __typename?: 'ReaderComment';
  annotationId: Scalars['ID']['output'];
  author?: Maybe<RemoteUser>;
  body: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  downvotes: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  myVote?: Maybe<VoteValue>;
  netScore: Scalars['Int']['output'];
  parentId?: Maybe<Scalars['ID']['output']>;
  status: ReaderStatus;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  upvotes: Scalars['Int']['output'];
};

export type ReaderObjectReference = {
  __typename?: 'ReaderObjectReference';
  id: Scalars['ID']['output'];
  ownerId: Scalars['ID']['output'];
  ownerType: Scalars['String']['output'];
};

/** A character range on a text. */
export type ReaderPosition = {
  __typename?: 'ReaderPosition';
  endOffset: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  startOffset: Scalars['Int']['output'];
  textId: Scalars['ID']['output'];
};

/** A learner level granted by a Discord guild role. */
export type ReaderRole = {
  __typename?: 'ReaderRole';
  cefrLevel?: Maybe<CefrLevel>;
  key: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

/** The website a reader text originated from. */
export type ReaderSource = {
  __typename?: 'ReaderSource';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export enum ReaderStatus {
  Active = 'ACTIVE',
  Hidden = 'HIDDEN'
}

/** A foreign-language text that users annotate. */
export type ReaderText = {
  __typename?: 'ReaderText';
  content: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  language: Scalars['String']['output'];
  level: CefrLevel;
  ownerId?: Maybe<Scalars['ID']['output']>;
  sourceId?: Maybe<Scalars['ID']['output']>;
  status: ReaderTextStatus;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ReaderTextInput = {
  content: Scalars['String']['input'];
  language: Scalars['String']['input'];
  level: CefrLevel;
  ownerId?: InputMaybe<Scalars['ID']['input']>;
  sourceId?: InputMaybe<Scalars['ID']['input']>;
  title: Scalars['String']['input'];
};

export enum ReaderTextStatus {
  Active = 'ACTIVE',
  Archived = 'ARCHIVED'
}

export enum ReaderVoteTarget {
  Annotation = 'ANNOTATION',
  Comment = 'COMMENT'
}

/** A user identity on a remote provider. */
export type RemoteUser = {
  __typename?: 'RemoteUser';
  id: Scalars['String']['output'];
  type: RemoteUserType;
};

export type RemoteUserInput = {
  id: Scalars['String']['input'];
  type: RemoteUserType;
};

export enum RemoteUserType {
  Discord = 'DISCORD'
}

export type ShareInput = {
  objectId: Scalars['ID']['input'];
  objectType: Scalars['String']['input'];
  relation: Scalars['String']['input'];
  subjectId: Scalars['ID']['input'];
  subjectType: Scalars['String']['input'];
};

export type ShareNotesInput = {
  subjectEmails?: InputMaybe<Array<Scalars['String']['input']>>;
  subjectIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  textId: Scalars['ID']['input'];
};

export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type StandardError = {
  __typename?: 'StandardError';
  message: Scalars['String']['output'];
};

/** Predicted CEFR level with confidence and contributing factors. */
export type TextLevelAssessment = {
  __typename?: 'TextLevelAssessment';
  confidence: Scalars['Float']['output'];
  factors: Array<ComplexityFactor>;
  level: CefrLevel;
  probabilities: Array<LevelProbability>;
};

/** A record that the current user has viewed a text. */
export type TextView = {
  __typename?: 'TextView';
  textId: Scalars['ID']['output'];
  viewedAt: Scalars['DateTime']['output'];
};

export type VoteInput = {
  targetId: Scalars['ID']['input'];
  targetType: ReaderVoteTarget;
  value: VoteValue;
};

export enum VoteValue {
  Down = 'DOWN',
  Up = 'UP'
}

/** A dictionary word with its translations, compounds, and related words. */
export type Word = {
  __typename?: 'Word';
  compounds: Array<WordEntry>;
  entries: Array<WordEntry>;
  id: Scalars['ID']['output'];
  relatedWords: Array<Word>;
  sourceUrl: Scalars['String']['output'];
  term: Scalars['String']['output'];
  wordType?: Maybe<Scalars['String']['output']>;
};

/** Which WordReference dictionary to query. */
export enum WordDictionary {
  English = 'ENGLISH',
  GreekEnglish = 'GREEK_ENGLISH'
}

/** A single dictionary entry for a headword. */
export type WordEntry = {
  __typename?: 'WordEntry';
  examples: Array<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  note?: Maybe<Scalars['String']['output']>;
  sense?: Maybe<Scalars['String']['output']>;
  term: Scalars['String']['output'];
  translations: Array<WordTranslation>;
  wordType: Scalars['String']['output'];
};

/** Which parts of a WordReference word page to include. */
export enum WordScope {
  AllTranslations = 'ALL_TRANSLATIONS',
  Compounds = 'COMPOUNDS',
  Examples = 'EXAMPLES',
  RelatedWords = 'RELATED_WORDS'
}

/** A translated term under a word entry. */
export type WordTranslation = {
  __typename?: 'WordTranslation';
  term: Scalars['String']['output'];
  usageNotes: Array<Scalars['String']['output']>;
  wordType?: Maybe<Scalars['String']['output']>;
};

export type DefineWordQueryVariables = Exact<{
  word: Scalars['String']['input'];
  scope?: InputMaybe<Array<WordScope> | WordScope>;
  dictionary?: InputMaybe<WordDictionary>;
}>;


export type DefineWordQuery = { __typename?: 'Query', hadesQueries: { __typename?: 'HadesQueries', defineWord?: { __typename?: 'Word', id: string, term: string, wordType?: string | null, sourceUrl: string, entries: Array<{ __typename?: 'WordEntry', id: string, term: string, wordType: string, sense?: string | null, examples: Array<string>, note?: string | null, translations: Array<{ __typename?: 'WordTranslation', term: string, wordType?: string | null, usageNotes: Array<string> }> }>, compounds: Array<{ __typename?: 'WordEntry', id: string, term: string, wordType: string, sense?: string | null, examples: Array<string>, note?: string | null, translations: Array<{ __typename?: 'WordTranslation', term: string, wordType?: string | null, usageNotes: Array<string> }> }>, relatedWords: Array<{ __typename?: 'Word', id: string, term: string, sourceUrl: string }> } | null } };


export const DefineWordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"defineWord"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"word"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"scope"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WordScope"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dictionary"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"WordDictionary"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hadesQueries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"defineWord"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"word"},"value":{"kind":"Variable","name":{"kind":"Name","value":"word"}}},{"kind":"Argument","name":{"kind":"Name","value":"scope"},"value":{"kind":"Variable","name":{"kind":"Name","value":"scope"}}},{"kind":"Argument","name":{"kind":"Name","value":"dictionary"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dictionary"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"term"}},{"kind":"Field","name":{"kind":"Name","value":"wordType"}},{"kind":"Field","name":{"kind":"Name","value":"sourceUrl"}},{"kind":"Field","name":{"kind":"Name","value":"entries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"term"}},{"kind":"Field","name":{"kind":"Name","value":"wordType"}},{"kind":"Field","name":{"kind":"Name","value":"sense"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"term"}},{"kind":"Field","name":{"kind":"Name","value":"wordType"}},{"kind":"Field","name":{"kind":"Name","value":"usageNotes"}}]}},{"kind":"Field","name":{"kind":"Name","value":"examples"}},{"kind":"Field","name":{"kind":"Name","value":"note"}}]}},{"kind":"Field","name":{"kind":"Name","value":"compounds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"term"}},{"kind":"Field","name":{"kind":"Name","value":"wordType"}},{"kind":"Field","name":{"kind":"Name","value":"sense"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"term"}},{"kind":"Field","name":{"kind":"Name","value":"wordType"}},{"kind":"Field","name":{"kind":"Name","value":"usageNotes"}}]}},{"kind":"Field","name":{"kind":"Name","value":"examples"}},{"kind":"Field","name":{"kind":"Name","value":"note"}}]}},{"kind":"Field","name":{"kind":"Name","value":"relatedWords"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"term"}},{"kind":"Field","name":{"kind":"Name","value":"sourceUrl"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DefineWordQuery, DefineWordQueryVariables>;