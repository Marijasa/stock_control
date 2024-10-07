
const useFormatCurrency = (value, currency) => {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: currency,
    }).format(value);
};


export default useFormatCurrency;
