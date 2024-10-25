
const useFormatCurrency = (value, currency) => {

    const local = {
        CRC: 'es-CR',
        USD: 'en-US',
    };

    return new Intl.NumberFormat(local[currency], {
        style: 'currency',
        currency: currency,
    }).format(value);


};


export default useFormatCurrency;
