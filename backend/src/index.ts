//This is just a mock script coded by myself to practice typescript syntax

function stepOne(callback: Function): void {
  setTimeout(() => {
    console.log("Step One");
    callback();
  }, 3000);
}

function stepTwo(callback: Function): void {
  setTimeout(() => {
    console.log("Step Two");
    callback();
  }, 2000);
}

function stepThree(callback: Function): void {
  setTimeout(() => {
    console.log("Step Three");
    callback();
  }, 1000);
}

function stepFour(callback: Function): void {
  setTimeout(() => {
    console.log("Step Four");
    callback();
  }, 500);
}

function stepFive(): void {
  setTimeout(() => {
    console.log("Step Five");
  }, 250);
}



function stepOnePromise(permission: boolean) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (permission) {
        resolve("Promise One Solved");
      } else {
        reject("Promise One Rejected");
      }
    }, 3000);
  });
}

function stepTwoPromise(permission: boolean) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (permission) {
        resolve("Promise Two Solved");
      } else {
        reject("Promise Two Rejected");
      }
    }, 2000);
  });
}

function stepThreePromise(permission: boolean) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (permission) {
        resolve("Promise Three Solved");
      } else {
        reject("Promise Three Rejected");
      }
    }, 1000);
  });
}

function stepFourPromise(permission: boolean) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (permission) {
        resolve("Promise Four Solved");
      } else {
        reject("Promise Four Rejected");
      }
    }, 500);
  });
}

function stepFivePromise(permission: boolean) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (permission) {
        resolve("Promise Five Solved");
      } else {
        reject("Promise Five Rejected");
      }
    }, 250);
  });
}


async function triggerAllFunctions() {
    stepOne(() => {
        stepTwo(() => {
          stepThree(() => {
            stepFour(() => {
              stepFive();
            });
          });
        });
      });
      try {
        const resultOne = await stepOnePromise(true);
        console.log({resultOne});
      } catch (error) {
        console.log({error});
      }
    
      try {
        const resultTwo = await stepTwoPromise(true);
        console.log({resultTwo});
      } catch (error) {
        console.log({error});
      }

      try {
        const resultThree = await stepThreePromise(true);
        console.log({resultThree});
      } catch (error) {
        console.log({error});
      }

      try {
        const resultFour = await stepFourPromise(true);
        console.log({resultFour});
      } catch (error) {
        console.log({error});
      }


      try {
        const resultFive = await stepFivePromise(true);
        console.log({resultFive});
      } catch (error) {
        console.log({error});
      }
}


triggerAllFunctions();