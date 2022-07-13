/*
 * @Author: hzm
 * @Date: 2022-07-13 14:23:06
 * @Description:
 */
/*
 * @Author: hzm
 * @Date: 2022-04-12 19:29:27
 * @Description:
 */

interface ObjType {
  [propName: string]: any
}

type Ids = number | string | string[] | number[]

interface CommonTree {
  label: string
  value: string
  children: CommonTree[]
}
