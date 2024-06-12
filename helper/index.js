export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getUTCMonth()]; 
    const day = date.getUTCDate().toString().padStart(2, '0'); 
    const year = date.getUTCFullYear();
  
    return `${month}-${day}-${year}`;
  }