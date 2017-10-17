class JPromise {
	//构造函数
	constructor(initAsyncFn){
		this._promiseStatus = JPromise.PENDING;
		this._promiseValue = null;
		this.execute(initAsyncFn);
	}
	//构造函数调用的执行函数
	execute(initAsyncFn){
		//判断传入的参数是否为函数
		if(typeof initAsyncFn !== 'function') throw new Error('您所传入的\"'+initAsyncFn+'\"不是一个函数!');
		try{
			initAsyncFn((data)=>{
				this._promiseStatus = JPromise.FULFILLED;
				this._promiseValue = data;
			},(data)=>{
				this._promiseStatus = JPromise.REJECTED;
				this._promiseValue = data;
			});
		}catch(err){
			this._promiseStatus = JPromise.REJECTED;
			this._promiseValue = err;
		}
	}
	//then函数，异步执行的回掉函数，参数为一个成功回调，一个失败回调。
	then(successFn,failedFn){
		let _tempPromise = null, //接受then的成功或者失败返回的JPromise对象。
			timer = null,
			resultPromise = new JPromise(()=>{}); //return的JPromise对象。
		//用setInterval对this._promiseStatus的状态进行监听
		timer = setInterval(()=>{ //注意，这里用到了es6的箭头函数，这样函数内的this还是指向JPromise的实力对象。
			try{
				if((typeof successFn === 'function' && this._promiseStatus === JPromise.FULFILLED) || (typeof failedFn === 'function' && this._promiseStatus === JPromise.REJECTED)){
					
					clearInterval(timer); //清除监听器
					if(this._promiseStatus === JPromise.FULFILLED){
						_tempPromise = successFn(this._promiseValue); //执行then函数中的第一个参数也就是成功回调函数。
					}else {
						_tempPromise = failedFn(this._promiseValue); //执行then函数中的第二个参数也就是失败回调函数。
					}
					//判断_tempPromise是否为JPromise对象？
					if(_tempPromise instanceof JPromise){ //是JPromise对象情况
						timer = setInterval(()=>{
							if(_tempPromise._promiseStatus === JPromise.FULFILLED || _tempPromise._promiseStatus === JPromise.REJECTED){
								clearInterval(timer);
								resultPromise._promiseStatus = JPromise.FULFILLED;
								resultPromise._promiseValue = _tempPromise._promiseValue;
							}
						},50);
					}else { //不是JPromise对象情况
						resultPromise._promiseStatus = JPromise.FULFILLED;
						resultPromise._promiseValue = _tempPromise;
					}
				}
			}catch(err){
				resultPromise._promiseStatus = JPromise.FULFILLED;
				resultPromise._promiseValue = err;
			}
		},50);
		return resultPromise;
	}
}

JPromise.PENDING = 'pending'; //等待状态
JPromise.FULFILLED = 'resolved'; //成功状态
JPromise.REJECTED = 'rejected'; //失败状态
