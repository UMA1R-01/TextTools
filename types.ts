export enum SortMethod {
  ALPHA_ASC = 'ALPHA_ASC',
  ALPHA_DESC = 'ALPHA_DESC',
  LENGTH_ASC = 'LENGTH_ASC',
  LENGTH_DESC = 'LENGTH_DESC',
  RANDOM = 'RANDOM',
  REVERSE_ORDER = 'REVERSE_ORDER',
  NUMERIC_ASC = 'NUMERIC_ASC',
  NUMERIC_DESC = 'NUMERIC_DESC',
}

export enum CaseMethod {
  UPPERCASE = 'UPPERCASE',
  LOWERCASE = 'LOWERCASE',
  TITLE_CASE = 'TITLE_CASE',
  SENTENCE_CASE = 'SENTENCE_CASE',
  CAMEL_CASE = 'CAMEL_CASE',
  SNAKE_CASE = 'SNAKE_CASE',
  KEBAB_CASE = 'KEBAB_CASE',
}

export enum CleanerMethod {
  REMOVE_DUPLICATES = 'REMOVE_DUPLICATES',
  REMOVE_EMPTY_LINES = 'REMOVE_EMPTY_LINES',
  TRIM_LINES = 'TRIM_LINES',
  NORMALIZE_SPACES = 'NORMALIZE_SPACES',
  STRIP_HTML = 'STRIP_HTML',
}

export interface ToolProps {
  isActive: boolean;
}

export interface NotificationState {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
}

export interface SortResult {
  text: string;
  count: number;
}