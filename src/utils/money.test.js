import { it, expect, describe } from "vitest";
import { formatMoney } from "./money";


describe('formatMoney', () => {
    it('format 1999 cents as Rs 19.99'), () => {
        expect(formatMoney(1999)).toBe('Rs 19.99');
    }

    it('dispay two decimals'), () => {
        expect(formatMoney(1090)).toBe('Rs 10.90');
    }

})

