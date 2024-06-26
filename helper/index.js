
import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie'; // Assuming you're using react-cookie for managing cookies
import { toast } from 'react-toastify';




export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getUTCMonth()]; 
    const day = date.getUTCDate().toString().padStart(2, '0'); 
    const year = date.getUTCFullYear();
  
    return `${month}-${day}-${year}`;
  }

  export const handleResponse = async (response  ,router, cookies,removeCookie) => {
   
    const data = await response.json();
    if (response.ok) {
      return data;
    } else if (response.status === 400) {
      // router.push("/vendor/login/access");
      console.log(">>>+++++++++++++++")
      removeCookie('myCookie', { path: '/' });
      router.push("/vendor/login/access");
      toast.error(data?.error);
      throw new Error(data?.error);
    } else {
      throw new Error("An unexpected error occurred");
    }
  };
  