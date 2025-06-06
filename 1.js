Promise.any([
  Promise.reject(new Error('some error 01')),
  Promise.reject(new Error('some error 02')),
  Promise.reject(new Error('some error 03')),
  Promise.reject(new Error('some error 04')),
  Promise.reject(new Error('some error 05')),
]).catch((e) => {
  console.log(e instanceof AggregateError); // true
  console.log(e.message); // "All Promises rejected"
  console.log(e.name); // "AggregateError"
  // console.log(e.errors.length); // [ Error: "some error" ]
});
