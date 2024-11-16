function numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function phoneNumberValidator(x?: string) {
    // const internationalRegex = /^\+234\d{10}$/;
    // Validate for local format (0 followed by 10 digits, starting with 7, 8, or 9)
    const localRegex = /^0[789]\d{9}$/;
    // return internationalRegex.test(x) || localRegex.test(x);
    if (x === '' || localRegex.test(x!)) {
        return true
    }
}


export { numberWithCommas, phoneNumberValidator }