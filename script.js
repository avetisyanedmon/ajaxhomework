function ajax() {}

class MyPromise {
        constructor(executor) {
                this.queue = []
                this.errorHandler = ajax
                this.finallyHandler = ajax

            try {
                executor.call(null, this.onResolve.bind(this), this.onReject.bind(this))
            } catch (e) {
                this.errorHandler(e)
            } finally {
                this.finallyHandler()
            }
        }

        onResolve(data) {
            this.queue.forEach(callback => {
            data = callback(data)
            })

            this.finallyHandler()
        }

        onReject(error) {
            this.errorHandler(error)

            this.finallyHandler()
        }

        then(fn) { 
            this.queue.push(fn)
            return this
        }
            
        catch(fn) {
            this.errorHandler = fn
            return this
        }

        finally(fn) {
            this.finallyHandler = fn
            return this
        }

    static all(promisesArray) {
            const results = [];
            return new MyPromise((resolve, reject) => {
                for(let promise of promisesArray) {
                    promise.then((resolveChild) => {
                        results.push(resolveChild);
                        if(results.length === promisesArray.length) {
                            resolve(results);
                        }
                    });
                }
            })
            
        }

}



const url  = 'https://jsonplaceholder.typicode.com/users'

function ajaxRequest (url, {type = 'GET', data = null, headers = {}}) {
    return new MyPromise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open([type], url)
    xhr.responseType = 'json'

    //to be used in case of "POST" requests
    for (let prop in headers) {
        xhr.setRequestHeader(prop, headers[prop])
    }

    xhr.onload = () => {
        if(xhr.status >= 400) {
            resolve(xhr.response)
        } else {
            reject(xhr.response)
        }
    }

    xhr.onerror = () => {
        reject(xhr.response)
    }
    // in case of "GET" request we can use xhr.send() without any params.
    xhr.send(JSON.stringify(data))
    })
}

//Some objects for testing 'setRequestHeder' and data sending in case of "POST" request

const body = {
    name: 'John',
    age: 33
}

const header = {
    ['content-type']: 'application/json'
}


const configs = {
    type: 'POST',
    data: body,
    headers: header
}


 ajaxRequest(url, configs)
.then(data => console.log(data))
.catch(err => console.log(err))


