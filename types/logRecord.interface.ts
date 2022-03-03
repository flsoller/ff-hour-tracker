export interface LogEntry {
  workType: string;
  hours: number;
}

export interface LogRecord {
  member: string;
  date: string;
  entry: LogEntry;
}
