export class FileNotFoundError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "FileNotFoundError";
  }
}

export class VideoNotFoundError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "VideoNotFoundError";
  }
}

export class DatabaseConnectionError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "DatabaseConnectionError";
  }
}

export class InternalServerError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "InternalServerError";
  }
}
