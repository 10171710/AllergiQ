
const el1 = document.querySelector('.tech-spec-card')?.closest('section')?.getBoundingClientRect();
const el2 = document.querySelector('.insurance-logo-box')?.closest('section')?.getBoundingClientRect();
console.log(JSON.stringify({med_tech: el1, insurance: el2}));
