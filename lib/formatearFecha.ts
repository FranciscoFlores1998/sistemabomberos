export const formatearFecha = (fecha: string) => {
  const date = new Date(fecha);
  //con formato de yyyy-mm-dd
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
}