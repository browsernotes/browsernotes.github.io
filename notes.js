// Data
const arr = ["eat", "sleep", "code"]

const obj = {
  name: "Betty",
  hobbies: ["walking", "jumping", "dancing"],
  logName: function () {
    // console.log(this.name)
  }
}
obj.logName() // functions are ignore by JSON (the delivery format for storage data)

//
// Session storage - data stored for duration of web page being open

sessionStorage.setItem("mySessionStoreObj", JSON.stringify(obj))
sessionStorage.setItem("mySessionStoreArr", JSON.stringify(arr))
const mySessionDataObj = JSON.parse(sessionStorage.getItem("mySessionStoreObj"))
const mySessionDataArr = JSON.parse(sessionStorage.getItem("mySessionStoreArr"))
console.log(mySessionDataObj)
console.log(mySessionDataArr)

//
// Local storage - persistent data storage remains after webpage is closed

localStorage.setItem("myLocalStoreObj", JSON.stringify(obj))
localStorage.setItem("myLocalStoreArr", JSON.stringify(arr))
const myLocalDataObj = JSON.parse(localStorage.getItem("myLocalStoreObj"))
const myLocalDataArr = JSON.parse(localStorage.getItem("myLocalStoreArr"))
console.log(myLocalDataObj)
console.log(myLocalDataArr)

//
// Remove or clear local storage data

localStorage.setItem("foo", JSON.stringify(obj))
// Remove a single item or Clear multiple items of storage data:
localStorage.removeItem("foo")
// localStorage.clear()
const bar = JSON.parse(localStorage.getItem("foo"))
console.log(bar)


// Local storage key

localStorage.setItem("foo", JSON.stringify(obj))
const key = localStorage.key(0)
const num = localStorage.length
// const boz = JSON.parse(localStorage.getItem("baz"))
console.log(key)
console.log(num)
