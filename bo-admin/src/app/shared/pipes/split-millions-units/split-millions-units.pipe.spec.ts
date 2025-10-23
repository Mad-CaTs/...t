import { SplitMillionsThousandsPipe } from './split-millions-units.pipe';

describe('SplitMillionsThousandsPipe', () => {
	it('create an instance', () => {
		const pipe = new SplitMillionsThousandsPipe();
		expect(pipe).toBeTruthy();
	});
});
