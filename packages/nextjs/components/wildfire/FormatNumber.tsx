const FormatNumber = ({ number }: { number: number }) => {
  let formattedNumber: string;

  if (number < 1000) {
    formattedNumber = number.toString();
  } else if (number < 10000) {
    const thousands = Math.floor(number / 1000);
    const remainder = number % 1000;
    formattedNumber = `${thousands}.${Math.floor(remainder / 100)}k`;
  } else if (number < 1000000) {
    formattedNumber = `${(number / 1000).toFixed(1)}k`;
  } else {
    formattedNumber = `${(number / 1000000).toFixed(1)}m`;
  }

  return formattedNumber;
};

export default FormatNumber;
