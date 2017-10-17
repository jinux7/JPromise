function async1() {
    return new JPromise(
        (resolve, reject) => {
            console.log('async1 start');
            setTimeout(() => {
                resolve('async1 finished')
            }, 1000);
        }
    );
}

function async2() {
    return new JPromise(
        (resolve, reject) => {
            console.log('async2 start');
            setTimeout(() => {
                resolve('async2 finished')
            }, 1000);
        }
    );
}

function async3() {
    return new JPromise(
        (resolve, reject) => {
            console.log('async3 start');
            setTimeout(() => {
                resolve('async3 finished');
            }, 1000);
        }
    );
}

async1()
    .then(
        data => {
            console.log(data);
            return async2();
        },data => {
            console.log('error');
            return async2();
        })
    .then(
        data => {
            console.log(data);
            //return async3();
            return 123456;
        }
    )
    .then(
        data => {
            console.log(data);
        }
    );