// console.log("start");

// function arjun(email, name, callback) {
//   setTimeout(() => {
//     callback({ email: email });
//   }, 500);
// }
// function arjun1(email, callback) {
//   setTimeout(() => {
//     callback({ email: email });
//   }, 1000);
// }
// function arjun2(email, callback) {
//   setTimeout(() => {
//     callback({ email: email });
//   }, 1000);
// }

// arjun("hi@gmail.com", "arjun", (user) => {
//   console.log(user);
//   arjun1("arar", (user) => {
//     console.log(user);
//     arjun2("arardds", (user) => {
//       console.log(user);
//     });
//   });
// });
// console.log("finish");

// console.log("start");

// function arjun(email, name) {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve({ email: email });
//     }, 500);
//   });
// }
// function arjun1(email) {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve({ email: email });
//     }, 1000);
//   });
// }
// function arjun2(email) {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve({ email: email });
//     }, 1000);
//   });
// }

// arjun("hi@gmail.com", "arjun")
//   .then((user) => {
//     console.log(user);
//     return arjun1("arar");
//   })
//   .then((user) => {
//     console.log(user);
//     return arjun2("ara34r");
//   })
//   .then((user) => {
//     console.log(user);
//   });
// console.log("finish");

console.log("start");

function arjun(email, name) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ email: email });
    }, 500);
  });
}
function arjun1(email) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ email: email });
    }, 1000);
  });
}
function arjun2(email) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ email: email });
    }, 1000);
  });
}

// arjun("hi@gmail.com", "arjun")
//   .then((user) => {
//     console.log(user);
//     return arjun1("arar");
//   })
//   .then((user) => {
//     console.log(user);
//     return arjun2("ara34r");
//   })
//   .then((user) => {
//     console.log(user);
//   });
// console.log("finish");

async function display() {
  const arju = await arjun("hi@gmail.com", "arjun");
  console.log(arju);
  const arj = await arjun1("hi@gma.com");
  console.log(arj);
  const aru = await arjun2("hi@gcom");
  console.log(aru);
}
display();
