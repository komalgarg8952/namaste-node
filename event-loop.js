const fs = require('fs');

setImmediate(()=>console.log("print from set immediate"));

setTimeout(()=>console.log("print from set timout"),0);

Promise.resolve('prmoise 1').then((res)=>console.log(res));
Promise.resolve('prmoise 2').then((res)=>console.log(res));


fs.readFile('./file.txt','utf8',()=>{
    setTimeout(()=>console.log("print from set timout2"),0);
    process.nextTick(()=>console.log("next tick is printed2"));
    // here setImmediate will print before setTimeout becuase event loop waits at poll phase and from here it will check nexttick and promise queue then it will go to check phase and print setImmedaite first then setTimout
    setImmediate(()=>console.log("print from set immediate2"));

console.log("last line2")
})

process.nextTick(()=>console.log("next tick is printed"));

console.log("last line")

