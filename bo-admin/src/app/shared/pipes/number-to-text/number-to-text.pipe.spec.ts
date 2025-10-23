import { NumberToTextPipe } from "./number-to-text.pipe";

describe('NumberToTextPipe', () => {
    it('create an instance', () => {
        const pipe = new NumberToTextPipe();
        expect(pipe).toBeTruthy();
    });
});
