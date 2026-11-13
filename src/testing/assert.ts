// Helpers for the type tests (`*.spec-d.ts`): they are only type-checked, never run

/** `true` when `A` and `B` are exactly the same type, `false` otherwise. */
export type Equals<A, B> = (<X>() => X extends A ? 1 : 2) extends <X>() => X extends B ? 1 : 2 ? true : false;

/** Compiles only when `T` is `true`. */
export declare function assertTrue<T extends true>(): void;

/** Compiles only when `value` is assignable to `T`. */
export declare function accept<T>(value: T): void;
