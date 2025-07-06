export type ErrorHelper = new (...args: Todo[]) => Error;

export class NotFoundError extends Error {}
export class ForbiddenError extends Error {}
export class ConflictError extends Error {}
export class InternalServerError extends Error {}
