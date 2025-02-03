// a=3;
// console.log(a)
// console.log(funcc)
// var funcc = function() {
//   console.log('hello')
// }
// // console.log(funcs)
// var funcs = () => {
//   console.log('hi')
// }
// console.log(funcs)
// console.log(funcs())
// console.log(funcc())
// var a=2

obj = {
  'name': 'riya',
  'age':21,
  'func': function() {
      return this.age
  }
}
obj2 = {
  age:60
}
console.log(obj.func.call(obj2))
let arr = new Array(1,2,3,4,5,6);

arr1 = arr.map((x,y,z)=>x*x)
console.log(arr1)

arr1 = arr.filter((x)=>{
  return x>2
})

arr1 = arr.reduce((acc,curr)=>acc+curr,0)
console.log(arr1)
Array.prototype.myMap = function (callbackFnc) {
  let arr = []
  for (let i =0;i<this.length;i++) {
    arr.push(callbackFnc(this[i],i,this))
  }
  return arr
}

Array.prototype.myFilter = function (callbackFnc) {
  let arr = []
  for (let i =0;i<this.length;i++) {
    if(callbackFnc(this[i],i,this)) {
      arr.push(this[i])
    }
  }
  return arr
}

Array.prototype.myReduce = function (callbackFnc,initialVal) {
  let initial = 0
  if(initialVal!=null) {
    accumulator = initialVal
  }else{
    accumulator = this[0]
    initial = this [1]
  }
  for (let i=initial;i<this.length;i++){
    accumulator = callbackFnc(accumulator,this[i],i,this);
    console.log('acc:',accumulator)
  }
  return accumulator
}

const sum = (acc,val)=> acc+val
arr = arr.myReduce(sum,0)

console.log(arr)



obj = {
  
}