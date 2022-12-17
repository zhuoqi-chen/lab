/**
 * 视频: https://www.bilibili.com/video/BV1RF411T7zu/
 * 类型交集
 */

/**
 * 1.父类收敛
 */
type a0 = 1 & number;
/**
 * 2.any类型和除了never其他类型交叉都是any类型
 */
type a1 = any & 1;
type a2 = any & never;

/**
 * 3.类型不存在相同的属性,新的类型包含所有交集的类型
 */
interface B1 {
  name: string;
  age: number;
}
interface B2 {
  sex: boolean;
}
/**
 * {
   name: string,
    age: number,
    sex: boolean,
 }
 */
type B3 = B1 & B2;
const b3: B3 = {
  name: "czq",
  age: 18,
  sex: true,
};
/**
 * 4.存在相同属性且不一样
 */
interface C1 {
  name: string;
  age: number;
}
interface C2 {
  name: number;
  sex: boolean;
}
/**
 * {
  name: never // string和number 没有交集所以是never
  age: number
  sex: boolean
 }
 */
type C3 = C1 & C2;
const c3: C3 = {
  name: "ss",
};

/**
 * 5.PartialByKeys 实现
 */

type PartialByKeys<T, K extends keyof T> = {
  [P in K]?: T[P];
} & Pick<T, Exclude<keyof T, K>>;

type Simply<T> = {
  [P in keyof T]: T[P];
};
type D1 = PartialByKeys<C1, "age">;
type D2 = Simply<D1>;

/**
 * 6.RequiredByKeys 实现
 */
type RequiredByKeys<T, K extends keyof T> = {
  [P in K]-?: T[P];
} & Pick<T, Exclude<keyof T, K>>;

interface E1 {
  name: string;
  age?: number;
  sex?: boolean;
}
type E2 = RequiredByKeys<E1, "age" | "sex">;
type E2Simple = Simply<E2>;
