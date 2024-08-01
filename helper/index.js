
import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';




export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getUTCMonth()]; 
    const day = date.getUTCDate().toString().padStart(2, '0'); 
    const year = date.getUTCFullYear();
  
    return `${month}-${day}-${year}`;
  }

export function formatDateWithTime(dateString) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  }).format(new Date(dateString));
}

  export const handleResponse = async (response  ,router, cookies,removeCookie) => {
    const data = await response.json();
    if (response.ok) {
      return data;
    } else if (response.status === 400) {
      // router.push("/vendor/login/access");
      removeCookie('myCookie', { path: '/' });
      router.push("/vendor/login/access");
      toast.error(data?.error);
      throw new Error(data?.error);
    } else {
      throw new Error("An unexpected error occurred");
    }
  };
  

  export const formatCamelCaseString = (str) => {
    const words = str.replace(/([A-Z])/g, ' $1');
    const formattedString = words
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  
    return formattedString;
  }

  export  const handleDownload = (filePath) => {
    if (typeof filePath === "string"){
      const link = document.createElement("a");
      link.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/files/${filePath?.split("/").pop()}`; 
      link.download = `${filePath.split("/").pop()}`; 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
   
  };

  export const urlPattern = new RegExp(
    "^(https?:\\/\\/)" + // Protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // Domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // Port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // Query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );