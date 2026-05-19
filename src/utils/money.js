export function formatMoney (amoutCents){
   return ` Rs ${(amoutCents / 100).toFixed(2)}`
}