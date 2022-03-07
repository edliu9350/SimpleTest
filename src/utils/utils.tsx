const formatNumber = (num: number) => {
    return parseFloat(num.toFixed(8)).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};
const formatCurrency = (num: number) => {
    let fiatFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
        });
    return fiatFormatter.format(parseFloat(num.toFixed(8)));
};
const formatPercent = (num: number) => {
    num = parseFloat(num.toFixed(2));
    return (num > 0 ? '' : '') + num + '%';
};
const validateEmail = (email: string) => {
    var reg = /\S+@\S+\.\S+/;
    return reg.test(email);
}
export default {
    formatNumber,
    formatCurrency,
    validateEmail,
    formatPercent
};