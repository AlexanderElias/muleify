/*
	@banner
	I am still here.
*/

import { one, two} from './one.i.js';
import { add } from './add.i.js';

/*
	@preserve
	I am still here again
*/

var sum = add(one, two);
console.log(`${sum}`)
console.log('bundle');
export default add;

/*
const p = Promise.resolve().then(function () {
    return 'hello world';
});

(async function () {

    const r = await p();
    console.log(r);

}()).catch(function (e) {
    console.log(e);
});
*/
