import { index } from '../src/server/server';

describe('Test Handlers', function () {

    test('responds to /', () => {
        const req = {  };

        const res = { text: '',
            send: function(input) { this.text = input } 
        };
        index(req, res);
        
        expect(res.text).toEqual('hello world!');
    });
})